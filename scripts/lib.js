'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'data', 'sizes.json');
const README_PATH = path.join(ROOT, 'README.md');

const BEGIN = '<!-- BEGIN GENERATED — edit data/sizes.json, then run `npm run build` -->';
const END = '<!-- END GENERATED -->';

function loadData() {
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
}

/** Every asset across every platform, tagged with its parent. */
function allAssets(data) {
  return data.platforms.flatMap((platform) =>
    platform.assets.map((asset) => ({ platform, asset }))
  );
}

/** GitHub's heading-anchor algorithm, near enough for our headings. */
function anchor(heading) {
  return heading
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s/g, '-');
}

function parseAspect(aspect) {
  const [w, h] = aspect.split(':').map(Number);
  if (!w || !h) return null;
  return w / h;
}

/** Dimension pairs an asset declares, as "W x H" strings. */
function declaredPairs(asset) {
  const pairs = [];
  const add = (w, h) => {
    if (w && h) pairs.push(`${w} x ${h}`);
  };
  add(asset.width, asset.height);
  if (asset.min) add(asset.min.width, asset.min.height);
  if (asset.max) add(asset.max.width, asset.max.height);
  for (const size of asset.sizes || []) add(size.width, size.height);
  return pairs;
}

/** Every integer an asset declares, for loose cross-checking against prose. */
function declaredNumbers(asset) {
  const numbers = new Set();
  const add = (n) => {
    if (n) numbers.add(String(n));
  };
  add(asset.width);
  add(asset.height);
  for (const bound of [asset.min, asset.max]) {
    if (bound) {
      add(bound.width);
      add(bound.height);
    }
  }
  for (const size of [...(asset.sizes || []), ...(asset.also || [])]) {
    add(size.width);
    add(size.height);
  }
  return numbers;
}

const ASPECT_TOLERANCE = 0.02; // 2%

const REQUIRED_ASSET_FIELDS = ['id', 'label', 'render', 'published', 'verified'];

function isValidDate(value) {
  if (typeof value !== 'string') return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && value === date.toISOString().slice(0, 10);
}

/**
 * The single definition of "is this asset entry sound?".
 *
 * Shared by scripts/validate.js (checking the whole file) and
 * scripts/triage-issue.js (checking one proposed entry from an issue), so a
 * contributor gets the same verdict in CI that a maintainer gets locally.
 *
 * `platformSourceUrls` is optional — only the repo-wide validator knows which
 * URLs a platform lists.
 */
function checkAsset(asset, { platformSourceUrls, today } = {}) {
  const errors = [];
  const warnings = [];
  const now = today || new Date().toISOString().slice(0, 10);

  for (const field of REQUIRED_ASSET_FIELDS) {
    if (asset[field] === undefined || asset[field] === null || asset[field] === '') {
      errors.push(`missing required field \`${field}\``);
    }
  }
  if (errors.length > 0) return { errors, warnings };

  // --- sourcing -----------------------------------------------------
  if (asset.published && !asset.source_url) {
    errors.push('`published: true` requires a `source_url`');
  }
  if (!asset.published && asset.source_url) {
    warnings.push('`published: false` but a `source_url` is set — should this be `published: true`?');
  }
  if (asset.source_url && platformSourceUrls && !platformSourceUrls.has(asset.source_url)) {
    warnings.push('`source_url` is not listed in the platform\'s `sources`');
  }

  // --- dates --------------------------------------------------------
  if (!isValidDate(asset.verified)) {
    errors.push(`\`verified\` is not a real YYYY-MM-DD date: ${asset.verified}`);
  } else if (asset.verified > now) {
    errors.push(`\`verified\` is in the future: ${asset.verified}`);
  }

  // --- aspect ratio vs dimensions -----------------------------------
  if (asset.aspect && asset.width && asset.height) {
    const declared = parseAspect(asset.aspect);
    const actual = asset.width / asset.height;
    if (declared === null) {
      errors.push(`unparseable aspect: ${asset.aspect}`);
    } else if (Math.abs(declared - actual) / actual > ASPECT_TOLERANCE) {
      errors.push(
        `aspect \`${asset.aspect}\` (${declared.toFixed(3)}) does not match ` +
          `${asset.width} x ${asset.height} (${actual.toFixed(3)})`
      );
    }
  }

  // --- render string vs machine fields ------------------------------
  // Both `render` and `qualifier` are user-facing prose, so a declared
  // dimension may legitimately live in either one.
  const prose = [asset.render, asset.qualifier || ''].join(' ');
  const proseNumbers = new Set(prose.match(/\d+/g) || []);
  const pairs = declaredPairs(asset);

  for (const pair of pairs) {
    const [w, h] = pair.split(' x ');
    const ok = prose.includes(pair) || (proseNumbers.has(w) && proseNumbers.has(h));
    if (!ok) {
      errors.push(`neither \`render\` nor \`qualifier\` mentions declared dimensions ${pair}`);
    }
  }
  if (pairs.length === 0 && asset.width && !proseNumbers.has(String(asset.width))) {
    errors.push(`neither \`render\` nor \`qualifier\` mentions declared width ${asset.width}`);
  }

  const numbers = declaredNumbers(asset);
  for (const pair of prose.match(/\d+\s*x\s*\d+/g) || []) {
    const normalized = pair.replace(/\s*x\s*/, ' x ');
    const [w, h] = normalized.split(' x ');
    if (!pairs.includes(normalized) && !(numbers.has(w) && numbers.has(h))) {
      warnings.push(`prose mentions ${normalized}, which is not in width/height/min/max/sizes`);
    }
  }

  return { errors, warnings };
}

module.exports = {
  ROOT,
  DATA_PATH,
  README_PATH,
  BEGIN,
  END,
  ASPECT_TOLERANCE,
  loadData,
  allAssets,
  anchor,
  parseAspect,
  declaredPairs,
  declaredNumbers,
  isValidDate,
  checkAsset,
};
