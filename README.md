# Social Media Image Sizes Reference Guide

An always up-to-date quick reference for social media image and video dimensions — profile photos, banners, posts, and link previews. Fast, no fluff, sourced. Want to fix or add something? See [Contributing].

[Contributing]: https://github.com/chuckreynolds/social-profile-image-sizes/blob/master/CONTRIBUTING.md

_Last verified: 2026-07-24_

_Values marked **[unpublished]** are not stated in any first-party doc — they're community/observed conventions. Everything else is quoted from the linked source._

![Social Media Image Sizes Reference Guide](https://raw.githubusercontent.com/chuckreynolds/social-profile-image-sizes/master/social-media-image-sizes-repo-header.jpg)

## Use it as data

Every size lives in [`data/sizes.json`](data/sizes.json) — the README is generated from it. No signup, no API key, no rate limit:

```
https://raw.githubusercontent.com/chuckreynolds/social-profile-image-sizes/master/data/sizes.json
```

```js
const res = await fetch('https://raw.githubusercontent.com/chuckreynolds/social-profile-image-sizes/master/data/sizes.json');
const { platforms } = await res.json();

const bluesky = platforms.find((p) => p.id === 'bluesky');
const banner = bluesky.assets.find((a) => a.id === 'banner');
// → { width: 1500, height: 500, aspect: '3:1', published: false, ... }
```

Each entry carries `width`, `height`, `aspect`, `min`/`max`, `max_bytes`, `formats`, `source_url`, and `verified`. The field that matters most is **`published`** — `false` means the platform documents no such size and the value is an observed convention. Filter on it when you need something you can cite:

```js
const citable = platforms.flatMap((p) => p.assets).filter((a) => a.published);
```

Schema: [`data/schema.json`](data/schema.json). Contributing or automating against this? See [AGENTS.md](AGENTS.md).

<!-- BEGIN GENERATED — edit data/sizes.json, then run `npm run build` -->

## Contents

- [X (formerly Twitter)](#x-formerly-twitter)
- [Facebook](#facebook)
- [Instagram](#instagram)
- [Threads](#threads)
- [LinkedIn](#linkedin)
- [YouTube](#youtube)
- [TikTok](#tiktok)
- [Bluesky](#bluesky)
- [Mastodon](#mastodon)
- [Reddit](#reddit)
- [Pinterest](#pinterest)
- [Tumblr](#tumblr)
- [Medium](#medium)
- [GitHub](#github)
- [Twitch](#twitch)
- [SoundCloud](#soundcloud)
- [Nextdoor](#nextdoor)
- [Google Business Profile](#google-business-profile)
- [Google Workspace (Gmail) Logo](#google-workspace-gmail-logo)
- [WordPress Plugin & Theme Dev](#wordpress-plugin--theme-dev)

## X (formerly Twitter)
* Profile Photo - 400 x 400 (max 2MB; JPEG / GIF / PNG, no animated GIFs)
* Header Image - 1500 x 500 (~60 px top and bottom can crop depending on monitor/browser)
* Post Image - 1024 x 512 **[unpublished]** (displays inline as 506 x 253; 1200 x 675 also common for landscape)
* Article Image - 5:2 ratio, e.g. 1000 x 400 **[unpublished]**
* Card `twitter:card = summary` - 1:1 **[unpublished]** (144 x 144 min, 4096 x 4096 max)
* Card `twitter:card = summary_large_image` - 2:1 ratio **[unpublished]** (300 x 157 min, 4096 x 4096 max)

_Note: X retired its Cards documentation when developer.x.com moved to docs.x.com — the old deep links now redirect to a generic overview and no replacement spec page exists. The card values below are the last officially published figures and can no longer be confirmed first-party._

Source: [help.x.com — uploading profile photos and headers and best sizes](https://help.x.com/en/managing-your-account/common-issues-when-uploading-profile-photo)

## Facebook
* Profile Photo - 320 x 320 **[unpublished]** (displays as a circle; Facebook no longer states a size)
* Cover Photo - 851 x 315 optimal (400 x 150 min; sRGB JPG under 100KB recommended)
  * _Crops to 16:9 on desktop and 2.4:1 on mobile — keep key content centered_
* Post Link Image (Open Graph) - 1200 x 630 (1.91:1; 600 x 315 min for the large render, 200 x 200 absolute min, 8MB max)
* Event Image - 1200 x 628 **[unpublished]**
* App Icon - 1024 x 1024 **[unpublished]** (PNG, for Facebook Login app config)

Sources: [facebook.com/help — cover photo](https://www.facebook.com/help/125379114252045), [developers.facebook.com — sharing best practices](https://developers.facebook.com/docs/sharing/webmasters/images)

## Instagram
* Profile Photo - 320 x 320 **[unpublished]** (displays as circle)
* Feed Posts - upload at 1080 px wide (Instagram keeps 320–1080 px wide as-is, downsizes anything larger)
  * _Supported aspect range is 1.91:1 to 3:4 — i.e. 1080 x 566 (landscape) through 1080 x 1440 (max portrait)_
  * _1080 x 1350 (4:5) and 1080 x 1080 (1:1) are the common picks; anything outside the range gets cropped_
* Stories & Reels - 9:16, min 720 px resolution, min 30 FPS (1080 x 1920 standard)
* Reel Cover Photo - 420 x 654 (1:1.55 — can't be changed after upload)
* Reel Safe Zone - 1080 x 1420 **[unpublished]** (top/bottom ~250 px overlaid by UI)

Sources: [help.instagram.com — image resolution](https://help.instagram.com/1631821640426723), [Reel size & aspect ratios](https://help.instagram.com/1038071743007909)

## Threads
* Profile Picture - 320 x 320 **[unpublished]** (1:1, syncs from Instagram)
* Post Image - 1080 x 1350 **[unpublished]** (4:5 portrait recommended; also 1:1 and 1.91:1)
* Carousel - up to 10 images **[unpublished]** (≥1080 px wide each)
* Video - 1080 x 1920 **[unpublished]**
* Link Preview - 1200 x 600 **[unpublished]**

_Note: Meta hasn't published first-party Threads media specs, so every value below is unpublished — derived from Instagram parity (Threads runs on IG infrastructure) and observed app behavior._

## LinkedIn
* Profile Photo - 400 x 400 (268 x 268 min)
* Profile Background - 1584 x 396

  **LinkedIn Company / Career pages**
  * Logo - 400 x 400 (268 x 268 min)
  * Cover Image - 4200 x 700
  * Life Tab Main Image - 1128 x 376
  * Life Tab Custom Modules - 502 x 282
  * Life Tab Company Photos - 900 x 600 (264 x 176 min)
  * Company Post Images (with link) - 1200 x 627 (1.91:1, 200 px min width)
    * _All page images: PNG or JPEG, 3MB max — LinkedIn recommends a high-res JPEG over PNG_

Sources: [linkedin.com/help — profile background](https://www.linkedin.com/help/linkedin/answer/a568217), [company & career pages](https://www.linkedin.com/help/linkedin/answer/a563309)

## YouTube
* Profile Picture - displays at 98 x 98 (15MB max; upload 800 x 800 so it stays sharp everywhere)
* Channel Banner / Cover - 2048 x 1152 min (16:9 ratio; 2560 x 1440 recommended for TV; safe area 1235 x 338; 6MB max)
* Video Thumbnail - 3840 x 2160 recommended (16:9, 640 px min width; 2MB max on mobile, 50MB on desktop)
  * _1:1 for podcast playlists. Vertical videos with 16:9 thumbnails get an auto-generated 4:5 replacement in some surfaces._
* YouTube Shorts Video - 1080 x 1920 **[unpublished]**
* Video Watermark - 150 x 150 min (square, under 1MB)

Sources: [support.google.com/youtube — manage your channel branding](https://support.google.com/youtube/answer/10456525), [video thumbnails](https://support.google.com/youtube/answer/72431)

## TikTok
* Profile Photo - 20 x 20 min is the *only* size TikTok publishes (upload 400 x 400 or larger square; displays as circle)
* Video Feed - 9:16 recommended, 540 x 960 min (per TikTok's ad specs; 1080 x 1920 is the practical standard)
  * _Also accepted: 16:9 (960 x 540 min) and 1:1 (640 x 640 min)_
* Photo Mode Posts - 1080 x 1920 **[unpublished]** (up to 35 photos per post)

Sources: [tiktok.com — adding a profile photo](https://www.tiktok.com/support/faq_detail?id=7581821549855038008), [ads.tiktok.com — in-feed ad video specifications](https://ads.tiktok.com/resources/help/article/tiktok-auction-in-feed-ads)

## Bluesky
* Profile Picture - 400 x 400 **[unpublished]**
* Banner Image - 1500 x 500 **[unpublished]**
* Post Image - 1080 x 1080 **[unpublished]** (max 1MB per image)
* Landscape Link Preview - 1200 x 627 **[unpublished]**
* Portrait Link Preview - 627 x 1200 **[unpublished]**

_Note: Bluesky publishes no size doc. All values below are unpublished — derived from the app and ATProto blob limits (1MB per image is the enforced one)._

Source: [bsky.app](https://bsky.app/)

## Mastodon
* Avatar - downscales to 400 x 400 (max 2MB; WEBP/PNG/GIF/JPG)
* Header - downscales to 1500 x 500 (max 2MB)

_Note: Defaults from the reference Mastodon server software; individual instances can override._

Source: [docs.joinmastodon.org — setting up your profile](https://docs.joinmastodon.org/user/profile/)

## Reddit
* Subreddit (Community) Icon - 300 x 300
* Subreddit Banner (desktop) - at least 1072 x 128
* Subreddit Banner (mobile) - at least 1080 x 128

Sources: [support.reddithelp.com — community icon](https://support.reddithelp.com/hc/en-us/articles/15484265952660-Community-icon), [banner](https://support.reddithelp.com/hc/en-us/articles/15484339588884-Banner)

## Pinterest
* Profile Photo - upload 400 x 400 **[unpublished]** (displays as 165 x 165 circle)
* Profile Cover - 1920 x 1080 **[unpublished]** (16:9; image or video)
* Standard Pin - 1000 x 1500 (2:3 ratio; larger ratios get cut off in feed)
  * _title: 100 char max — text box: 250 char max — description: up to 800 char (first 50–60 show in feed)_
  * _safe zones: 270 px top, 65 px left, 195 px right, 790 px bottom_
  * _file: BMP / JPEG / PNG / TIFF / WEBP, 20MB max on web_
* Video Pin - 1080 x 1920 (9:16 ratio; 4 seconds to 5 minutes, H.264 or H.265)
* Board Cover - 600 x 600 **[unpublished]**

Sources: [business.pinterest.com — creative best practices](https://business.pinterest.com/creative-best-practices/), [help.pinterest.com — pin specs](https://help.pinterest.com/en/article/review-pin-specs)

## Tumblr
* Avatar - 128 x 128 (max 10MB; JPEG / PNG / WEBP — GIFs go static)
* Header Image - 2048 x 1152 (16:9, max 10MB)
* Post Image - 540 x 810 recommended (2:3 dashboard view; displays up to 2048 x 3072 on click if no click-through link is set)
  * _20MB per image; 10 images per post in the apps, 30 on web_

Source: [help.tumblr.com — image & GIF troubleshooting](https://help.tumblr.com/knowledge-base/image-gif-troubleshooting/)

## Medium
* Post Image - at least 1192 px wide (below that, the full-width and outset placement options don't appear)
  * _Max file size 25MB (.JPG, .JPEG, .GIF, .PNG)_

_Note: Medium has no published spec for profile or post-cover dimensions; the platform scales images to fit its display contexts._

Source: [help.medium.com — using images](https://help.medium.com/hc/en-us/articles/215679797-Using-images)

## GitHub
* Profile (Identicon) Picture - 500 x 500 **[unpublished]**
* Repo Social Preview Image - 1280 x 640 (640 x 320 min, under 1MB)

Source: [docs.github.com — repository social preview](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview)

## Twitch
* Profile Picture - upload 800 x 800 **[unpublished]** (max display 256 x 256, 10MB max)
* Profile Banner - 1200 x 480 (scales to browser width; images are scaled to 480 high, so keep the artwork weighted left)
* Panel Images - 320 x 300 max (under 2.9MB; larger images are resized to these maximums automatically)
* Video Offline Banner - 1920 x 1080 **[unpublished]** (16:9; 1280 x 720 also accepted)
* Subscriber Emoticons - 28 x 28, 56 x 56, 112 x 112 (PNG, under 100KB each in manual mode, or a single 112–4096 px square PNG under 1MB with auto-resize)
  * _PNG format and the 112–4096 px auto-resize range come from the Emote Guidelines article; animated emotes are GIF, with a 512KB per-file cap in manual mode._
* Subscriber Badges - 18 x 18, 36 x 36, 72 x 72 (PNG, ≤25KB each)

_Note: help.twitch.tv is a Salesforce app that frequently fails to render for automated checks; read it in a browser. Re-read in full 2026-08-03: the channel setup article now states dimensions only for the profile banner and info panels. The profile picture and video player banner sizes it used to carry are gone, so those are marked unpublished._

Sources: [help.twitch.tv — channel page setup](https://help.twitch.tv/s/article/channel-page-setup), [subscriber emote guide](https://help.twitch.tv/s/article/subscriber-emote-guide), [emote formatting & instant emote upload requirements](https://help.twitch.tv/s/article/emote-guidelines), [subscriber badge guide](https://help.twitch.tv/s/article/subscriber-badge-guide)

## SoundCloud
* Profile Image - square, at least 800 x 800 (max 2MB, .jpg or .png)
* Track Artwork - 1400 x 1400 **[unpublished]** (SoundCloud's upload guidance, not in the profile doc)
* Profile Header Banner - at least 2480 x 520 (max 2MB — below 1240 x 260 the zoom control is disabled)

Source: [help.soundcloud.com — update your profile image and header](https://help.soundcloud.com/hc/en-us/articles/115003450007-Update-Your-Profile-Image-and-Header)

## Nextdoor
* Agency / Business Profile Banner - 580 x 180
* Agency / Business Profile Logo - 120 x 120

_Note: Nextdoor's help article gives only the two values below. The larger figures widely circulated for Nextdoor (500 x 500 profile, 1156 x 650 banner) don't appear in any current first-party doc — use the published sizes._

Source: [help.nextdoor.com — add a banner, photo, or logo to your public agency profile](https://help.nextdoor.com/s/article/How-to-add-a-banner-or-logo?language=en_US)

## Google Business Profile
_Formerly "Google My Business" / "Google Local Business Center"_

* Logo & all photos - 720 x 720 recommended (250 x 250 min, 10KB–5MB, JPG or PNG)
* Cover Photo - 1024 x 576 **[unpublished]** (16:9 — Google applies one spec to every photo type)

_Note: Google publishes a single set of requirements for logos, cover photos, and additional photos alike. Any per-type dimensions you see elsewhere are convention, not spec._

Source: [support.google.com/business — photos](https://support.google.com/business/answer/6103862)

## Google Workspace (Gmail) Logo
* Header Logo - 320 x 132 exact (PNG / JPG / GIF, non-animated; renders across Gmail, Calendar, Drive)

Source: [knowledge.workspace.google.com — add your logo to Google Workspace](https://knowledge.workspace.google.com/admin/getting-started/add-your-logo-to-google-workspace)

## WordPress Plugin & Theme Dev
* Site Icon (Customizer → Site Identity → Site Icon) - square, at least 512 x 512
* Theme Screenshot - 1200 x 900 (`screenshot.png` or `.jpg` in theme root; must not exceed 1200 x 900)
* Plugin Icons - 256 x 256, and 128 x 128
* Plugin Header Banners - 1544 x 500, and 772 x 250
  * _Plugin images go in an `/assets/` directory: `banner-1544x500.png`, `banner-772x250.png`, `icon-128x128.png`, `icon-256x256.png`_

Sources: [developer.wordpress.org — plugin assets](https://developer.wordpress.org/plugins/wordpress-org/plugin-assets/), [theme structure (screenshot)](https://developer.wordpress.org/themes/core-concepts/theme-structure/), [wordpress.org — customizer (site icon)](https://wordpress.org/documentation/article/customizer/)

<!-- END GENERATED -->
---

## Why this guide?
It's just a pain to go searching for this info to update company, personal, and client profiles, and with as much as it changes per site there needs to be one place for it. There are a lot of posts with infographics and too much wording. This is fast and simple. Plus I made it a repo instead of a Gist so people can help me update it. **See: [Contributing].**

## Notes
* Most profile images are square — best to have a 600 x 600ish image you can use for all the square profile photos and let the sites resize them to what they want.
* All sizes here are in pixels (px).
* If a single number is listed, that's the width — height doesn't matter in that case.
* **[unpublished]** means the platform doesn't state a size anywhere official. The value is a working convention that generally renders well — but it can't be cited, and it can drift.
* Platforms move and retire their docs constantly. If a source link 404s or redirects to a generic page, please [open an issue or PR](https://github.com/chuckreynolds/social-profile-image-sizes/blob/master/CONTRIBUTING.md).
