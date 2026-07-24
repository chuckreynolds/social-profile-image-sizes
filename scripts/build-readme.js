#!/usr/bin/env node
'use strict';

/**
 * Renders the platform sections of README.md from data/sizes.json.
 *
 *   node scripts/build-readme.js          write README.md
 *   node scripts/build-readme.js --check  exit 1 if README.md is stale (CI)
 */

const fs = require('fs');
const { README_PATH, BEGIN, END, loadData, anchor } = require('./lib');

function renderSources(sources) {
  if (!sources || sources.length === 0) return null;
  const links = sources.map((s) => `[${s.title}](${s.url})`).join(', ');
  return `${sources.length === 1 ? 'Source' : 'Sources'}: ${links}`;
}

function renderAsset(asset) {
  const parts = [`* ${asset.label} - ${asset.render}`];
  if (!asset.published) parts.push(' **[unpublished]**');
  if (asset.qualifier) parts.push(` (${asset.qualifier})`);

  const lines = [parts.join('')];
  for (const detail of asset.detail || []) {
    lines.push(`  * _${detail}_`);
  }
  return lines;
}

function renderPlatform(platform) {
  const lines = [`## ${platform.name}`];

  if (platform.subtitle) lines.push(`_${platform.subtitle}_`, '');

  let currentGroup = null;
  for (const asset of platform.assets) {
    const group = asset.group || null;
    if (group !== currentGroup) {
      if (group) lines.push('', `  **${group}**`);
      currentGroup = group;
    }
    // Grouped assets render one level deeper.
    const indent = group ? '  ' : '';
    for (const line of renderAsset(asset)) lines.push(indent + line);
  }

  if (platform.note) lines.push('', `_Note: ${platform.note}_`);

  const sources = renderSources(platform.sources);
  if (sources) lines.push('', sources);

  return lines.join('\n');
}

function renderContents(data) {
  const items = data.platforms.map(
    (p) => `- [${p.name}](#${anchor(p.name)})`
  );
  return ['## Contents', '', ...items].join('\n');
}

function build(data) {
  const sections = data.platforms.map(renderPlatform);
  return [renderContents(data), ...sections].join('\n\n');
}

function main() {
  const check = process.argv.includes('--check');
  const data = loadData();
  const readme = fs.readFileSync(README_PATH, 'utf8');

  const start = readme.indexOf(BEGIN);
  const end = readme.indexOf(END);
  if (start === -1 || end === -1) {
    console.error(
      `README.md is missing the generated-block markers.\nExpected:\n  ${BEGIN}\n  ${END}`
    );
    process.exit(1);
  }

  const generated = build(data);
  const next =
    readme.slice(0, start + BEGIN.length) +
    '\n\n' +
    generated +
    '\n\n' +
    readme.slice(end);

  if (check) {
    if (next !== readme) {
      console.error(
        'README.md is out of sync with data/sizes.json.\nRun `npm run build` and commit the result.'
      );
      process.exit(1);
    }
    console.log('README.md is in sync with data/sizes.json.');
    return;
  }

  fs.writeFileSync(README_PATH, next);
  const assetCount = data.platforms.reduce((n, p) => n + p.assets.length, 0);
  console.log(
    `Wrote README.md — ${data.platforms.length} platforms, ${assetCount} assets.`
  );
}

main();
