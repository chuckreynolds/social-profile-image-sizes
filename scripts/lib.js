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

module.exports = {
  ROOT,
  DATA_PATH,
  README_PATH,
  BEGIN,
  END,
  loadData,
  allAssets,
  anchor,
  parseAspect,
  declaredPairs,
  declaredNumbers,
};
