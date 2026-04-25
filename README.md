# Social Media Image Sizes Reference Guide

An always up-to-date quick reference for social media image and video dimensions — profile photos, banners, posts, and link previews. Fast, no fluff, sourced. Want to fix or add something? See [Contributing].

[Contributing]: https://github.com/chuckreynolds/social-profile-image-sizes/blob/master/CONTRIBUTING.md

_Last verified: 2026-04-25_

![Social Media Image Sizes Reference Guide](https://raw.githubusercontent.com/chuckreynolds/social-profile-image-sizes/master/social-media-image-sizes-repo-header.jpg)

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
* Profile Photo - 400 x 400
* Header Image - 1500 x 500
* Post Image - 1024 x 512 (displays inline as 506 x 253; 1200 x 675 also common for landscape)
* Article Image - 5:2 ratio (e.g. 1000 x 400)
* Card `twitter:card = summary` - 1:1 (144 x 144 min, 4096 x 4096 max)
* Card `twitter:card = summary_large_image` - 2:1 ratio (300 x 157 min, 4096 x 4096 max)

Sources: [help.x.com — customize your profile](https://help.x.com/en/managing-your-account/how-to-customize-your-profile), [developer.x.com — summary card with large image](https://developer.x.com/en/docs/x-for-websites/cards/overview/summary-card-with-large-image)

## Facebook
* Profile Photo - 320 x 320 (displays at 170 x 170)
* Cover Photo - 851 x 315 (display: 820 x 312 desktop, 640 x 360 mobile)
* Post Link Image (Open Graph) - 1200 x 630 (1.91:1, 600 x 315 min, 8MB max)
* Event Image - 1200 x 628 (1.91:1)
* App Icon - 1024 x 1024 (PNG, for Facebook Login app config)

Sources: [facebook.com/help — cover photo](https://www.facebook.com/help/125379114252045), [profile photo](https://www.facebook.com/help/163248423739693), [developers.facebook.com — sharing best practices](https://developers.facebook.com/docs/sharing/webmasters/images)

## Instagram
* Profile Photo - 320 x 320 (displays as circle)
* Feed Posts - 1080 x 1350 (4:5 portrait recommended); also 1080 x 1080 (1:1) and 1080 x 566 (1.91:1)
* Stories & Reels - 1080 x 1920 (9:16 ratio)
* Reel Safe Zone - 1080 x 1420 (top/bottom ~250 px overlaid by UI)

Sources: [help.instagram.com — image resolution](https://help.instagram.com/1631821640426723), [Reel size & aspect ratios](https://help.instagram.com/1038071743007909)

## Threads
* Profile Picture - 320 x 320 (1:1, syncs from Instagram)
* Post Image - 1080 x 1350 (4:5 portrait recommended); also 1:1 and 1.91:1
* Carousel - up to 10 images (≥1080 px wide each)
* Video - 1080 x 1920 (9:16)
* Link Preview - 1200 x 600 (2:1)

_Note: Meta hasn't published first-party Threads media specs; values above are derived from Instagram parity (Threads runs on IG infrastructure) and observed app behavior._

## LinkedIn
* Profile Photo - 400 x 400 (268 x 268 min)
* Profile Background - 1584 x 396

  **LinkedIn Company / Career pages**
  * Logo - 400 x 400 (268 x 268 min)
  * Cover Image - 4200 x 700
  * Life Tab Main Image - 1128 x 376
  * Life Tab Custom Modules - 502 x 282
  * Life Tab Company Photos - 900 x 600
  * Company Post Images (with link) - 1200 x 627 (1.91:1)

Sources: [linkedin.com/help — profile background](https://www.linkedin.com/help/linkedin/answer/a568217), [company & career pages](https://www.linkedin.com/help/linkedin/answer/a563309)

## YouTube
* Profile Picture - displays at 98 x 98 (recommend uploading 800 x 800)
* Channel Banner / Cover - 2048 x 1152 min (16:9 ratio); 2560 x 1440 recommended for TV; safe area 1235 x 338
* Video Thumbnail - 1280 x 720 (16:9, 640 px min width); larger up to 3840 x 2160
* YouTube Shorts Video - 1080 x 1920 (9:16 ratio)
* Video Watermark - 150 x 150 min

Sources: [support.google.com/youtube — channel branding](https://support.google.com/youtube/answer/2972003), [video thumbnails](https://support.google.com/youtube/answer/72431)

## TikTok
* Profile Photo - 400 x 400 (200 x 200 min, displays as circle)
* Video Feed - 1080 x 1920 (9:16 ratio)
* Photo Mode Posts - 1080 x 1920 (9:16); up to 35 photos per post

Source: [TikTok Ads creative specs](https://ads.tiktok.com/help/article/tiktok-video-ad-specifications)

## Bluesky
* Profile Picture - 400 x 400 (1:1)
* Banner Image - 1500 x 500
* Post Image - 1080 x 1080 (max 1MB per image)
* Landscape Link Preview - 1200 x 627 (1.91:1 ratio)
* Portrait - 627 x 1200 (4:5 ratio)

Source: [bsky.app](https://bsky.app/) (no formal published size doc — derived from app and ATProto limits)

## Mastodon
* Avatar - downscales to 400 x 400 (max 2MB; WEBP/PNG/GIF/JPG)
* Header - downscales to 1500 x 500 (max 2MB)

_Note: defaults from the reference Mastodon server software; individual instances can override._

Source: [docs.joinmastodon.org — setting up your profile](https://docs.joinmastodon.org/user/profile/)

## Reddit
* Subreddit (Community) Icon - 300 x 300
* Subreddit Banner (desktop) - at least 1072 x 128
* Subreddit Banner (mobile) - at least 1080 x 128

Sources: [support.reddithelp.com — community icon](https://support.reddithelp.com/hc/en-us/articles/15484265952660-Community-icon), [banner](https://support.reddithelp.com/hc/en-us/articles/15484339588884-Banner)

## Pinterest
* Profile Photo - upload 400 x 400 (displays as 165 x 165 circle)
* Profile Cover - 1920 x 1080 (16:9; image or video)
* Standard Pin - 1000 x 1500 (2:3 ratio, up to 1560 tall before crop)
  * _(title: 100 char max — description: 500 char max, first 50–60 show in feed)_
* Video Pin - 1080 x 1920 (9:16 ratio)
* Board Cover - 600 x 600 (1:1)

Sources: [business.pinterest.com — creative best practices](https://business.pinterest.com/creative-best-practices/), [help.pinterest.com — pin specs](https://help.pinterest.com/en/article/review-pin-specs)

## Tumblr
* Avatar - 128 x 128 (max 10MB)
* Header Image - 2048 x 1152 (16:9, max 10MB)
* Post Image - 1280 x 1920 (2:3 ratio); up to 2048 x 3072 max; 540 x 810 dashboard view

Source: [help.tumblr.com — image & GIF troubleshooting](https://help.tumblr.com/knowledge-base/image-gif-troubleshooting/)

## Medium
* Inline Post Image - at least 1400 px wide
* Full-Width Post Image - at least 2500 px wide

_Note: Medium has no published spec for profile or post-cover dimensions; the platform scales images to fit its display contexts._

Source: [help.medium.com — using images](https://help.medium.com/hc/en-us/articles/215679797-Using-images)

## GitHub
* Profile (Identicon) Picture - 500 x 500
* Repo Social Preview Image - 1280 x 640 (640 x 320 min, under 1MB)

Source: [docs.github.com — repository social preview](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview)

## Twitch
* Profile Picture - upload 800 x 800 (max display 256 x 256, 10MB max)
* Profile Banner - 1200 x 480 (≤3MB)
* Panel Images - 320 wide max (height up to 600)
* Video Offline Banner - 1920 x 1080 (16:9; 1280 x 720 also accepted)
* Subscriber Emoticons - 28 x 28, 56 x 56, 112 x 112 (PNG, ≤512KB each, or single 112–4096 px square ≤1MB)
* Subscriber Badges - 18 x 18, 36 x 36, 72 x 72 (PNG, ≤25KB each)

Sources: [help.twitch.tv — channel page setup](https://help.twitch.tv/s/article/channel-page-setup), [subscriber emote guide](https://help.twitch.tv/s/article/subscriber-emote-guide), [subscriber badge guide](https://help.twitch.tv/s/article/subscriber-badge-guide)

## SoundCloud
* Profile / Track Artwork - 1400 x 1400 (800 x 800 min)
* Profile Header Banner - 2480 x 520 (max 2MB)

Source: [help.soundcloud.com — profile image and header](https://help.soundcloud.com/hc/en-us/articles/115003450007-Profile-image-and-header)

## Nextdoor
* Profile Image - 500 x 500 (1:1, max 7MB)
* Profile / Agency Header Banner - 1156 x 650 (578 x 325 min, max 10MB)

Source: [help.nextdoor.com — add a banner or logo](https://help.nextdoor.com/s/article/How-to-add-a-banner-or-logo)

## Google Business Profile
_Formerly "Google My Business" / "Google Local Business Center"_

* Logo - 720 x 720 (1:1, 250 x 250 min, max 5MB)
* Cover Photo - 1024 x 576 (16:9, 480 x 270 min, max 5MB)
* Additional Photos - 1200 x 900 (4:3, 720 x 720 min)

Source: [support.google.com/business — photos](https://support.google.com/business/answer/6103862)

## Google Workspace (Gmail) Logo
* Header Logo - 320 x 132 exact (PNG / JPG / GIF; renders across Gmail, Calendar, Drive)

Source: [support.google.com/a — add your logo](https://support.google.com/a/answer/96474)

## WordPress Plugin & Theme Dev
* Site Icon (Customizer → Site Identity → Site Icon) - 512 x 512
* Theme Screenshot - 1200 x 900 (.png preferred, in theme root)
* Plugin Icons - 256 x 256, and 128 x 128
* Plugin Header Banners - 1544 x 500, and 772 x 250
* _(Plugin images go in an `/assets/` directory: `banner-1544x500.png`, `banner-772x250.png`, `icon-128x128.png`, `icon-256x256.png`)_

Sources: [developer.wordpress.org — plugin assets](https://developer.wordpress.org/plugins/wordpress-org/plugin-assets/), [theme screenshots](https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/#theme-screenshots), [make.wordpress.org — plugin icons](https://make.wordpress.org/plugins/2014/08/21/plugin-icons/)

---

## Why this guide?
It's just a pain to go searching for this info to update company, personal, and client profiles, and with as much as it changes per site there needs to be one place for it. There are a lot of posts with infographics and too much wording. This is fast and simple. Plus I made it a repo instead of a Gist so people can help me update it. **See: [Contributing].**

## Notes
* Most profile images are square — best to have a 600 x 600ish image you can use for all the square profile photos and let the sites resize them to what they want.
* All sizes here are in pixels (px).
* If a single number is listed, that's the width — height doesn't matter in that case.
