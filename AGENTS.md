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

## Proposing a change from outside the repo

If you're an agent working on someone else's behalf and you notice a size here
is wrong, you're welcome to report it. Some ground rules, because a wrong
number submitted confidently costs more to review than no number at all.

**Do not open an issue for a size you did not read on a first-party page.**

Not from another size guide. Not from a blog post. Not from training data. If
you know the number but can't produce a URL and a quoted sentence, that's not
a report — say so to your user instead and let them decide.

### What a good report contains

Use the [agent-submitted size change](.github/ISSUE_TEMPLATE/agent-proposal.md)
template. It's plain markdown so you can fill it via `gh issue create --body`.
Non-negotiable fields:

- **The URL you actually fetched** — not a search result, not the homepage.
- **The date you fetched it.** Sources move; a stale quote is still evidence
  of what was true when you read it.
- **A verbatim quote** of the sentence stating the number. This is what makes
  the report checkable after the page changes.
- **How you fetched it.** If the host bot-blocks (see below), say whether you
  used a browser. A number scraped from a Cloudflare challenge page is not a
  number.
- **Disclosure that an agent wrote the issue.** Say it plainly.

One platform per issue. A single issue proposing eleven changes across six
platforms is unreviewable.

### What happens when you file

CI triages the issue automatically and comments with what it found. It:

- validates your proposed JSON against the same rules as `npm run validate`
- fetches the URL you cited
- **checks your quoted line actually appears on that page**
- checks the proposed dimensions appear on the page at all

It re-runs on every edit, so you can fix an issue and watch the report update
rather than waiting on a maintainer. If the host bot-blocks, the check says so
and defers to a human — it won't hold that against you.

The quote check is the one to care about. A fabricated quote fails it
immediately, which is the point.

### What gets closed

- Numbers with no source, or with a source that doesn't state the number.
- "According to [some other size guide]…" — the whole point of this repo is not
  being that.
- Bulk submissions generated by sweeping a model over the README.
- PRs that hand-edit `README.md`. It's generated; edit `data/sizes.json` and
  run `npm run build`.

### Reporting an absence

"Platform X no longer publishes this size" is a genuinely valuable report and
the hardest kind to get. If you fetched the doc and the number is simply gone,
say that — propose `published: false` with a note explaining what the source
used to say. Don't quietly leave it alone because you have nothing to replace
it with.

### If you're opening a PR

Run `npm run validate` first. It checks data integrity and that `README.md` was
rebuilt from the data — the same thing CI runs, so it fails locally or it fails
in the PR. Bump `verified` on anything you touched, and update
`meta.last_verified` if yours is now the newest date.

## Tone

Dimensions first, prose second. A note earns its place only when something
non-obvious bites people — a file-size cap, a safe zone, a crop that differs
between desktop and mobile.
