# Working in this repo

This is a reference guide. Its only value is being **right and citable**. A
plausible-looking wrong number is worse than no number, because someone will
ship a cropped logo because of it.

## The one rule

**Every size traces to a first-party source, or it's marked unpublished.**

First-party means the platform's own help docs, developer docs, or brand
guidelines. Not a blog post, not an SEO listicle, not another size guide, and
not your own recollection of what the size used to be.

If a platform doesn't publish a number, that is a *finding*, not a gap to fill
from memory. Set `published: false` and say so.

## Where things live

| Path | What it is |
|---|---|
| `data/sizes.json` | **Source of truth.** Every size lives here. |
| `data/schema.json` | JSON Schema for the above. |
| `README.md` | Generated. Do not hand-edit the block between the markers. |
| `scripts/build-readme.js` | Renders README from the data. |
| `scripts/validate.js` | Integrity checks beyond what the schema catches. |
| `scripts/check-sources.js` | Walks every source URL; reports dead/moved/stale. |

## Changing a size

1. Edit `data/sizes.json` — never `README.md` directly.
2. Set `source_url` to the page that literally states the number, and bump
   `verified` to today.
3. Update `meta.last_verified` if yours is now the newest date.
4. `npm run build` to regenerate the README.
5. `npm run validate` before committing. CI runs the same thing.

## Adding an asset

Required: `id`, `label`, `render`, `published`, `verified`. Everything else is
optional but fill in what you know — `width`/`height`/`min`/`max`/`aspect`/
`max_bytes`/`formats` are what machine consumers actually read.

`render` is the human phrase shown in the README ("at least 2480 x 520"). The
validator cross-checks it against the structured fields, so the two can't
silently drift.

Use `also[]` for secondary dimensions — rendered display size, safe areas,
accepted alternates — rather than burying them in prose.

## Verifying (the part agents get wrong)

**Fetch the page. Read the number. Don't infer it.**

Two traps, both hit during the July 2026 audit:

1. **A 403 is not a dead link.** X, Reddit, SoundCloud, Instagram, Medium and
   Facebook all refuse plain HTTP clients while serving the page fine to a
   browser. `scripts/check-sources.js` knows these hosts and reports them as
   BLOCKED. Verify them with a real browser, never conclude "gone" from a
   status code alone.

2. **A live URL can be the wrong page.** The README cited a YouTube article
   for three years that contains no dimensions at all. Confirm the page you
   fetched actually states the number you're recording.

Twitch's help portal (Salesforce) frequently fails to render headless. It is
not broken; it needs a browser.

## Tone

Dimensions first, prose second. A note earns its place only when something
non-obvious bites people — a file-size cap, a safe zone, a crop that differs
between desktop and mobile.
