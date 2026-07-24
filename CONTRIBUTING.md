# Contributing

This repo lives or dies on accuracy. Platforms change image specs without notice and I don't get a firehose of those updates — that's where you come in. If something is wrong, outdated, or missing, please help me fix it.

## How to contribute

**Open an [Issue]** with:
- the value being changed (or the platform/dimension being added)
- the new value
- a link to a **first-party source** — the platform's official help docs, dev docs, or brand guidelines, not a third-party blog post

If you're comfortable with markdown, send a [Pull Request] directly. Same sourcing rule applies.

**One thing to know before you PR:** `README.md` is generated. Edit [`data/sizes.json`](data/sizes.json) instead, then run `npm run build` and commit both. `npm run validate` catches the usual mistakes and CI runs it on every PR. Full details in [AGENTS.md](AGENTS.md).

If neither of those is your thing, just [DM me on X] and lmk what needs fixing.

## What stays in / out

- Sizes must come from a first-party source. If a platform doesn't publish a spec, that gets noted inline.
- Kept simple — dimensions first; brief notes only when something unusual (file-size cap, safe zone) makes a real difference.
- New platforms welcome if they have broad use. Not chasing every long-tail network.

Thanks for the help — I'll review as fast as I can.

[Issue]: https://github.com/chuckreynolds/social-profile-image-sizes/issues
[Pull Request]: https://github.com/chuckreynolds/social-profile-image-sizes/compare
[DM me on X]: https://x.com/chuckreynolds
