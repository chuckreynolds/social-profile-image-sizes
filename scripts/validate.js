#!/usr/bin/env node
'use strict';

/**
 * Validates data/sizes.json beyond what JSON Schema can express:
 *
 *   - unique ids
 *   - published:true entries carry a source_url
 *   - declared aspect ratio actually matches declared width/height
 *   - the human-readable `render` string agrees with the machine fields
 *   - verified dates are real, not in the future, and meta.last_verified
 *     matches the newest asset
 *
 * The aspect check is the one that earns its keep: it caught 627 x 1200
 * being labelled 4:5 when it is really 1:1.91.
 */

const { loadData, allAssets, parseAspect, declaredPairs, declaredNumbers } = require('./lib');

const ASPECT_TOLERANCE = 0.02; // 2%

const errors = [];
const warnings = [];

function error(where, message) {
  errors.push(`${where}: ${message}`);
}

function warn(where, message) {
  warnings.push(`${where}: ${message}`);
}

function isValidDate(value) {
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && value === date.toISOString().slice(0, 10);
}

function main() {
  const data = loadData();
  const today = new Date().toISOString().slice(0, 10);

  const platformIds = new Set();
  let newestVerified = '0000-00-00';

  for (const platform of data.platforms) {
    if (platformIds.has(platform.id)) {
      error(platform.id, 'duplicate platform id');
    }
    platformIds.add(platform.id);

    const sourceUrls = new Set((platform.sources || []).map((s) => s.url));
    const assetIds = new Set();

    for (const asset of platform.assets) {
      const where = `${platform.id}/${asset.id}`;

      if (assetIds.has(asset.id)) error(where, 'duplicate asset id');
      assetIds.add(asset.id);

      // --- sourcing ---------------------------------------------------
      if (asset.published && !asset.source_url) {
        error(where, 'published:true requires a source_url');
      }
      if (!asset.published && asset.source_url) {
        warn(where, 'published:false but a source_url is set — should this be published:true?');
      }
      if (asset.source_url && !sourceUrls.has(asset.source_url)) {
        warn(where, `source_url is not listed in ${platform.id}.sources`);
      }

      // --- dates ------------------------------------------------------
      if (!isValidDate(asset.verified)) {
        error(where, `verified is not a real date: ${asset.verified}`);
      } else {
        if (asset.verified > today) {
          error(where, `verified is in the future: ${asset.verified}`);
        }
        if (asset.verified > newestVerified) newestVerified = asset.verified;
      }

      // --- aspect ratio vs dimensions ---------------------------------
      if (asset.aspect && asset.width && asset.height) {
        const declared = parseAspect(asset.aspect);
        const actual = asset.width / asset.height;
        if (declared === null) {
          error(where, `unparseable aspect: ${asset.aspect}`);
        } else if (Math.abs(declared - actual) / actual > ASPECT_TOLERANCE) {
          error(
            where,
            `aspect ${asset.aspect} (${declared.toFixed(3)}) does not match ` +
              `${asset.width} x ${asset.height} (${actual.toFixed(3)})`
          );
        }
      }

      // --- render string vs machine fields ----------------------------
      // Both `render` and `qualifier` are user-facing prose, so a declared
      // dimension may legitimately live in either one.
      const prose = [asset.render, asset.qualifier || ''].join(' ');
      const proseNumbers = new Set(prose.match(/\d+/g) || []);
      const pairs = declaredPairs(asset);

      for (const pair of pairs) {
        const [w, h] = pair.split(' x ');
        // Accept the literal pair, or both numbers appearing separately
        // (e.g. render "320 wide max" + qualifier "height up to 600").
        const ok =
          prose.includes(pair) || (proseNumbers.has(w) && proseNumbers.has(h));
        if (!ok) {
          error(where, `neither render nor qualifier mentions declared dimensions ${pair}`);
        }
      }

      if (pairs.length === 0 && asset.width && !proseNumbers.has(String(asset.width))) {
        error(where, `neither render nor qualifier mentions declared width ${asset.width}`);
      }

      // Any WxH pair written in prose should exist in the machine fields,
      // otherwise the text is carrying numbers the data doesn't know about.
      const numbers = declaredNumbers(asset);
      for (const pair of prose.match(/\d+\s*x\s*\d+/g) || []) {
        const normalized = pair.replace(/\s*x\s*/, ' x ');
        const [w, h] = normalized.split(' x ');
        if (!pairs.includes(normalized) && !(numbers.has(w) && numbers.has(h))) {
          warn(where, `prose mentions ${normalized}, which is not in width/height/min/max/sizes`);
        }
      }
    }
  }

  // --- meta ---------------------------------------------------------
  if (data.meta.last_verified !== newestVerified) {
    error(
      'meta',
      `last_verified is ${data.meta.last_verified} but the newest asset was verified ${newestVerified}`
    );
  }

  // --- report -------------------------------------------------------
  const assets = allAssets(data);
  const unpublished = assets.filter(({ asset }) => !asset.published).length;

  for (const message of warnings) console.warn(`warning  ${message}`);
  for (const message of errors) console.error(`error    ${message}`);

  console.log(
    `\n${data.platforms.length} platforms, ${assets.length} assets ` +
      `(${unpublished} unpublished), ${warnings.length} warnings, ${errors.length} errors.`
  );

  if (errors.length > 0) process.exit(1);
}

main();
