#!/usr/bin/env node
'use strict';

/**
 * Triages a size-change issue and writes a markdown report.
 *
 *   node scripts/triage-issue.js --body-file issue.md [--out report.md]
 *
 * Checks, in order of how much they're worth:
 *
 *   1. Is the proposed JSON structurally sound? (same rules as `npm run validate`)
 *   2. Does the cited page still exist?
 *   3. **Does the quoted line actually appear on that page?**
 *   4. Do the proposed numbers appear on that page at all?
 *
 * (3) is the whole point. Anyone can paste a URL; pasting a quote that
 * survives an automated check against the live page is a much stronger
 * signal that someone — human or agent — actually read the thing.
 *
 * Exit code is always 0. This reports; a human decides.
 */

const fs = require('fs');
const { checkAsset, loadData } = require('./lib');

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

/** Hosts that refuse bots. A failure here proves nothing either way. */
const BOT_BLOCKING_HOSTS = [
  'help.x.com', 'developer.x.com', 'docs.x.com', 'support.reddithelp.com',
  'help.soundcloud.com', 'help.instagram.com', 'help.medium.com',
  'www.facebook.com', 'developers.facebook.com', 'www.linkedin.com',
  'help.twitch.tv', 'ads.tiktok.com', 'support.tiktok.com', 'www.tiktok.com',
  'business.pinterest.com', 'help.pinterest.com', 'help.nextdoor.com',
];

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i === -1 ? fallback : process.argv[i + 1];
}

function isBotBlocking(url) {
  try {
    return BOT_BLOCKING_HOSTS.includes(new URL(url).host);
  } catch {
    return false;
  }
}

// --- parsing the issue body -----------------------------------------

function field(body, label) {
  const re = new RegExp(`\\*\\*${label}:?\\*\\*\\s*([^\\n]*)`, 'i');
  const match = body.match(re);
  if (!match) return null;
  // Strip template comments and placeholder text.
  const value = match[1].replace(/<!--[\s\S]*?-->/g, '').trim();
  return value === '' ? null : value;
}

function codeBlocks(body) {
  const blocks = [];
  const re = /```(\w*)\n([\s\S]*?)```/g;
  let match;
  while ((match = re.exec(body))) {
    blocks.push({ lang: match[1].toLowerCase(), content: match[2].trim() });
  }
  return blocks;
}

const PLACEHOLDER = /paste the sentence|what it should say|e\.g\.|<!--/i;

function parseIssue(body) {
  const blocks = codeBlocks(body);
  const jsonBlock = blocks.find((b) => b.lang === 'json');
  const quoteBlock = blocks.find((b) => b.lang !== 'json' && !PLACEHOLDER.test(b.content));

  let proposed = null;
  let jsonError = null;
  if (jsonBlock) {
    try {
      proposed = JSON.parse(jsonBlock.content);
    } catch (err) {
      jsonError = err.message;
    }
  }

  return {
    platform: field(body, 'Platform'),
    asset: field(body, 'Asset'),
    changeType: field(body, 'Change type'),
    url: (field(body, 'URL fetched') || '').replace(/^<|>$/g, '') || null,
    fetchedOn: field(body, 'Date fetched'),
    how: field(body, 'How'),
    quote: quoteBlock ? quoteBlock.content : null,
    proposed,
    jsonError,
  };
}

// --- checking the cited page ----------------------------------------

function toText(html) {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ');
}

/** Loose comparison: case, whitespace and punctuation shouldn't decide this. */
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

async function fetchPage(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': UA, accept: 'text/html,*/*' },
    });
    if (!res.ok) {
      return { ok: false, status: res.status, final: res.url };
    }
    return { ok: true, status: res.status, final: res.url, text: toText(await res.text()) };
  } catch (err) {
    return { ok: false, status: 0, final: url, error: err.message };
  } finally {
    clearTimeout(timer);
  }
}

// --- report ----------------------------------------------------------

const PASS = '✅';
const FAIL = '❌';
const WARN = '⚠️';
const SKIP = 'ℹ️';

async function main() {
  const bodyFile = arg('--body-file');
  if (!bodyFile) {
    console.error('usage: triage-issue.js --body-file <path> [--out <path>]');
    process.exit(2);
  }
  const body = fs.readFileSync(bodyFile, 'utf8');
  const issue = parseIssue(body);

  const lines = [];
  const missing = [];
  let blocking = 0;

  // --- 1. required evidence ----------------------------------------
  if (!issue.url) missing.push('the URL you fetched');
  if (!issue.quote) missing.push('a verbatim quote of the line stating the number');
  if (!issue.fetchedOn) missing.push('the date you fetched it');

  if (missing.length > 0) {
    blocking++;
    lines.push(
      `${FAIL} **Missing required evidence:** ${missing.join(', ')}.`,
      '',
      'See [AGENTS.md](../blob/master/AGENTS.md#proposing-a-change-from-outside-the-repo). ' +
        'A size without a source and a quote can\'t be reviewed.'
    );
  } else {
    lines.push(`${PASS} Required evidence present (URL, quote, date).`);
  }

  // --- 2. proposed JSON ---------------------------------------------
  if (issue.jsonError) {
    blocking++;
    lines.push(`${FAIL} **Proposed JSON doesn't parse:** ${issue.jsonError}`);
  } else if (!issue.proposed) {
    lines.push(`${SKIP} No proposed JSON block — a maintainer will translate this by hand.`);
  } else {
    const { errors, warnings } = checkAsset(issue.proposed);
    if (errors.length > 0) {
      blocking++;
      lines.push(
        `${FAIL} **Proposed entry fails validation** (same checks as \`npm run validate\`):`,
        ...errors.map((e) => `   - ${e}`)
      );
    } else {
      lines.push(`${PASS} Proposed entry passes validation.`);
    }
    if (warnings.length > 0) {
      lines.push(`${WARN} Warnings:`, ...warnings.map((w) => `   - ${w}`));
    }
  }

  // --- 3. does the source say what the issue claims? ----------------
  if (issue.url) {
    const page = await fetchPage(issue.url);

    if (!page.ok && isBotBlocking(issue.url)) {
      lines.push(
        `${SKIP} **Couldn't verify the quote automatically.** \`${new URL(issue.url).host}\` ` +
          `refuses automated clients (status ${page.status || 'transport error'}), which says ` +
          'nothing about whether the page is right. Needs a human with a browser.'
      );
    } else if (!page.ok) {
      blocking++;
      lines.push(
        `${FAIL} **Cited page returned ${page.status || 'a transport error'}.**` +
          (page.error ? ` (${page.error})` : '')
      );
    } else {
      if (page.final !== issue.url) {
        lines.push(`${WARN} Cited URL redirects to \`${page.final}\` — worth citing the final URL.`);
      }

      const haystack = normalize(page.text);
      const needle = normalize(issue.quote || '');

      if (needle && haystack.includes(needle)) {
        lines.push(`${PASS} **Quote found on the cited page.** This is the strong signal.`);
      } else if (needle) {
        blocking++;
        lines.push(
          `${FAIL} **Quote not found on the cited page.**`,
          '',
          '   The page was fetched successfully but does not contain that sentence. ' +
            'Either the quote is paraphrased, the content is rendered client-side, or ' +
            'the number came from somewhere other than this page.'
        );
      }

      // Secondary signal: do the numbers appear at all?
      if (issue.proposed) {
        const wanted = [issue.proposed.width, issue.proposed.height].filter(Boolean);
        if (wanted.length > 0) {
          const found = wanted.filter((n) => new RegExp(`\\b${n}\\b`).test(page.text));
          if (found.length === wanted.length) {
            lines.push(`${PASS} Proposed dimensions (${wanted.join(' x ')}) appear on the page.`);
          } else {
            lines.push(
              `${WARN} Only ${found.length}/${wanted.length} of the proposed dimensions ` +
                `(${wanted.join(' x ')}) appear on the page text.`
            );
          }
        }
      }
    }
  }

  // --- 4. context for the maintainer --------------------------------
  if (issue.platform && issue.proposed) {
    const data = loadData();
    const platform = data.platforms.find(
      (p) => p.id === issue.platform.toLowerCase() ||
        p.name.toLowerCase() === issue.platform.toLowerCase()
    );
    if (!platform) {
      lines.push(`${SKIP} No platform \`${issue.platform}\` in \`data/sizes.json\` — treating as new.`);
    } else {
      const existing = platform.assets.find((a) => a.id === issue.proposed.id);
      if (existing) {
        lines.push(
          '',
          `**Current entry** for \`${platform.id}/${existing.id}\`:`,
          '```json',
          JSON.stringify(existing, null, 2),
          '```'
        );
      } else {
        lines.push(`${SKIP} No asset \`${issue.proposed.id}\` under \`${platform.id}\` — treating as new.`);
      }
    }
  }

  const verdict =
    blocking === 0
      ? `${PASS} **Automated checks passed.** Ready for review.`
      : `${FAIL} **${blocking} blocking issue${blocking === 1 ? '' : 's'}.** ` +
        'Please update the issue — this re-runs on every edit.';

  const report = [
    '<!-- triage-report -->',
    '### Automated triage',
    '',
    verdict,
    '',
    ...lines,
    '',
    '---',
    '<sub>Posted by the `triage-issue` workflow. It checks evidence and structure, ' +
      'not whether the number is correct — a human still confirms that.</sub>',
  ].join('\n');

  const out = arg('--out');
  if (out) fs.writeFileSync(out, report);
  console.log(report);

  // Surface the verdict to the workflow without failing the run.
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `blocking=${blocking}\nstatus=${blocking === 0 ? 'pass' : 'needs-info'}\n`
    );
  }
}

main();
