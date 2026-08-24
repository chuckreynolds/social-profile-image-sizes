#!/usr/bin/env node
'use strict';

/**
 * Checks every source URL in data/sizes.json and reports:
 *
 *   DEAD        404/410, or an error status from a host that answers bots
 *   MOVED       redirected to a different path — the doc probably moved
 *   BLOCKED     a host known to need a browser refused us (needs a human)
 *   UNREACHABLE transport-level failure: TLS chain, DNS, timeout
 *   STALE       entry hasn't been re-verified in --max-age days
 *   OK          reachable, same URL
 *
 *   node scripts/check-sources.js [--max-age 90] [--json]
 *
 * Why BLOCKED exists: during the July 2026 audit, curl returned 403 for
 * X, Reddit, SoundCloud, Instagram, Medium and Facebook — every one of
 * those pages was alive and correct when opened in a real browser. A
 * checker that calls those "broken" trains you to ignore it.
 */

const { loadData } = require('./lib');

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

/**
 * Hosts a plain HTTP client can't check. Two flavours, same conclusion:
 * most refuse bots outright (403/400), and help.nextdoor.com serves an
 * incomplete cert chain that Node rejects and browsers accept. Either way
 * the result is inconclusive, not fatal — a human opens the page.
 */
const NEEDS_A_BROWSER = [
  'help.x.com',
  'developer.x.com',
  'docs.x.com',
  'support.reddithelp.com',
  'help.soundcloud.com',
  'help.instagram.com',
  'help.medium.com',
  'www.facebook.com',
  'developers.facebook.com',
  'www.linkedin.com',
  'help.twitch.tv',
  'ads.tiktok.com',
  'support.tiktok.com',
  'www.tiktok.com',
  'business.pinterest.com',
  'help.pinterest.com',
  'help.nextdoor.com', // incomplete cert chain, not a bot block
];

const TIMEOUT_MS = 25000;

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i === -1 ? fallback : process.argv[i + 1];
}

function needsABrowser(url) {
  try {
    return NEEDS_A_BROWSER.includes(new URL(url).host);
  } catch {
    return false;
  }
}

/** Ignore trailing slashes, query strings and locale params when comparing. */
function samePage(a, b) {
  try {
    const ua = new URL(a);
    const ub = new URL(b);
    return (
      ua.host === ub.host &&
      ua.pathname.replace(/\/$/, '') === ub.pathname.replace(/\/$/, '')
    );
  } catch {
    return a === b;
  }
}

async function checkUrl(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': UA, accept: 'text/html,*/*' },
    });

    const moved = !samePage(url, res.url);

    if (res.status === 404 || res.status === 410) {
      return { status: 'DEAD', code: res.status, final: res.url };
    }
    if (!res.ok) {
      return needsABrowser(url)
        ? { status: 'BLOCKED', code: res.status, final: res.url }
        : { status: 'DEAD', code: res.status, final: res.url };
    }
    if (moved) {
      return { status: 'MOVED', code: res.status, final: res.url };
    }
    return { status: 'OK', code: res.status, final: res.url };
  } catch (err) {
    // A transport failure never proves the page is gone, and for the hosts
    // we already know need a browser it proves nothing at all.
    const reason = err.cause?.code || err.message;
    return needsABrowser(url)
      ? { status: 'BLOCKED', code: 0, final: url, error: reason }
      : { status: 'UNREACHABLE', code: 0, final: url, error: reason };
  } finally {
    clearTimeout(timer);
  }
}

function daysSince(date) {
  const then = new Date(`${date}T00:00:00Z`).getTime();
  return Math.floor((Date.now() - then) / 86400000);
}

async function main() {
  const maxAge = Number(arg('--max-age', '90'));
  const asJson = process.argv.includes('--json');
  const data = loadData();

  // One check per unique URL, remembering who cites it.
  const citations = new Map();
  for (const platform of data.platforms) {
    for (const source of platform.sources || []) {
      if (!citations.has(source.url)) citations.set(source.url, new Set());
      citations.get(source.url).add(platform.id);
    }
    for (const asset of platform.assets) {
      if (!asset.source_url) continue;
      if (!citations.has(asset.source_url)) citations.set(asset.source_url, new Set());
      citations.get(asset.source_url).add(`${platform.id}/${asset.id}`);
    }
  }

  const results = [];
  for (const [url, cited] of citations) {
    const result = await checkUrl(url);
    results.push({ url, cited: [...cited], ...result });
  }

  // Staleness is independent of whether the link resolves.
  const stale = [];
  for (const platform of data.platforms) {
    for (const asset of platform.assets) {
      const age = daysSince(asset.verified);
      if (age > maxAge) {
        stale.push({ id: `${platform.id}/${asset.id}`, verified: asset.verified, age });
      }
    }
  }

  if (asJson) {
    console.log(JSON.stringify({ results, stale, maxAge }, null, 2));
  } else {
    const order = { DEAD: 0, MOVED: 1, UNREACHABLE: 2, BLOCKED: 3, OK: 4 };
    results.sort((a, b) => order[a.status] - order[b.status]);
    for (const r of results) {
      const detail = r.status === 'MOVED' ? `\n              → ${r.final}` : '';
      console.log(`${r.status.padEnd(11)} ${r.code || '—'}  ${r.url}${detail}`);
      if (r.status === 'DEAD' || r.status === 'MOVED') {
        console.log(`              cited by: ${r.cited.join(', ')}`);
      }
      if (r.error) {
        console.log(`              ${r.error}`);
      }
    }
    if (stale.length > 0) {
      console.log(`\nSTALE (>${maxAge} days since verification):`);
      for (const s of stale) {
        console.log(`  ${s.id} — ${s.verified} (${s.age} days)`);
      }
    }
  }

  const count = (status) => results.filter((r) => r.status === status).length;
  const dead = results.filter((r) => r.status === 'DEAD');

  console.log(
    `\n${results.length} sources — ${dead.length} dead, ${count('MOVED')} moved, ` +
      `${count('UNREACHABLE')} unreachable, ${count('BLOCKED')} blocked ` +
      `(inconclusive), ${stale.length} stale entries.`
  );

  // Only genuinely-gone docs fail the build. Moved and stale open issues
  // via the workflow but shouldn't break anything on their own.
  if (dead.length > 0) process.exit(1);
}

main();
