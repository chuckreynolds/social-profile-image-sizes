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
 * The per-asset rules live in lib.checkAsset so scripts/triage-issue.js
 * applies exactly the same standard to proposals arriving via issues.
 *
 * The aspect check is the one that earns its keep: it caught 627 x 1200
 * being labelled 4:5 when it is really 1:1.91.
 */

const { loadData, allAssets, checkAsset, isValidDate } = require('./lib');

const errors = [];
const warnings = [];

function main() {
  const data = loadData();
  const today = new Date().toISOString().slice(0, 10);

  const platformIds = new Set();
  let newestVerified = '0000-00-00';

  for (const platform of data.platforms) {
    if (platformIds.has(platform.id)) {
      errors.push(`${platform.id}: duplicate platform id`);
    }
    platformIds.add(platform.id);

    const platformSourceUrls = new Set((platform.sources || []).map((s) => s.url));
    const assetIds = new Set();

    for (const asset of platform.assets) {
      const where = `${platform.id}/${asset.id}`;

      if (assetIds.has(asset.id)) errors.push(`${where}: duplicate asset id`);
      assetIds.add(asset.id);

      const result = checkAsset(asset, { platformSourceUrls, today });
      for (const message of result.errors) errors.push(`${where}: ${message}`);
      for (const message of result.warnings) warnings.push(`${where}: ${message}`);

      if (isValidDate(asset.verified) && asset.verified > newestVerified) {
        newestVerified = asset.verified;
      }
    }
  }

  if (data.meta.last_verified !== newestVerified) {
    errors.push(
      `meta: last_verified is ${data.meta.last_verified} but the newest asset ` +
        `was verified ${newestVerified}`
    );
  }

  const assets = allAssets(data);
  const unpublished = assets.filter(({ asset }) => !asset.published).length;

  for (const message of warnings) console.warn(`warning  ${message.replace(/`/g, '')}`);
  for (const message of errors) console.error(`error    ${message.replace(/`/g, '')}`);

  console.log(
    `\n${data.platforms.length} platforms, ${assets.length} assets ` +
      `(${unpublished} unpublished), ${warnings.length} warnings, ${errors.length} errors.`
  );

  if (errors.length > 0) process.exit(1);
}

main();
