---
name: verify-sizes
description: Re-verify social media image sizes in data/sizes.json against their first-party sources. Use when asked to audit, re-verify, or check the sizes, when a source-check issue needs resolving, or when adding a platform or asset that needs sourcing.
---

# Verifying sizes

Goal: confirm every number in `data/sizes.json` still matches what the
platform actually publishes, and record what changed.

Read `AGENTS.md` first — it holds the sourcing rule and the two failure modes
that make this task go wrong.

## 1. Triage before fetching anything

```bash
npm run check-sources -- --max-age 90
```

This partitions the work:

- **DEAD / MOVED** — the doc relocated. Find where it went before checking numbers.
- **STALE** — reachable but not confirmed recently. These need a read.
- **BLOCKED / UNREACHABLE** — inconclusive, needs a browser. Not evidence of anything.
- **OK** — link resolves. Says nothing about whether the *numbers* still match.

## 2. Fetch and read

Try `WebFetch` first. When a host blocks it, drive a real browser
(`mcp__plugin_playwright_playwright__browser_navigate`, then
`browser_evaluate` to pull `document.body.innerText`). These hosts need the
browser path every time:

`help.x.com` · `support.reddithelp.com` · `help.soundcloud.com` ·
`help.instagram.com` · `help.medium.com` · `help.twitch.tv` · `support.tiktok.com`

Batch independent fetches in a single message — a full pass is ~30 URLs and
serial fetching wastes the session.

For each asset, answer three questions:

1. Does this page still exist, at this URL?
2. Does it state the number recorded in `sizes.json`?
3. Is it stating it *about this asset*? (A page can be live, current, and
   about something else entirely.)

## 3. Record what you found

Edit `data/sizes.json` only:

- Number confirmed → bump `verified` to today.
- Number changed → update it, bump `verified`, keep `source_url` pointing at
  the page that says so.
- Page no longer states it → `published: false`, drop `source_url`, add a
  `notes[]` entry explaining what the source used to say.
- Doc moved → update the URL in both `sources[]` and the asset's `source_url`.

Then:

```bash
npm run build      # regenerate README.md
npm run validate   # data integrity + README in sync
```

## 4. Report

Lead with what changed, not what didn't. Group as:

- **Corrected** — number was wrong, now fixed (say what it was and what it is).
- **Source moved** — same number, new URL.
- **Lost its source** — was published, no longer is, now marked unpublished.
- **Unverified** — couldn't confirm and why. Say this plainly; don't let an
  unchecked value pass as checked.

Never mark something verified you did not actually read. An unverified entry
honestly labelled is fine. A wrong entry labelled verified poisons the repo.
