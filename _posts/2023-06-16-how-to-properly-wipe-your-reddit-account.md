---
layout: post
title: How To Properly Wipe Your Reddit Account
date: 2023-06-16 10:41 +0100
categories: post
usemathjax: false
description: Reddit keeps your comments and posts up even after deleting your account! This guide will quickly show you how to prevent this
tags:
    - reddit
    - automation
---

Reddit recently introduced insane API changes, akin to those introduced by twitter, that are essentially forcing all 3rd party app creators to take down their products. [Apollo](https://www.reddit.com/r/apolloapp/comments/144f6xm/apollo_will_close_down_on_june_30th_reddits/) was the first (as far as I am aware) with my personal favourite, [BaconReader](https://www.reddit.com/r/baconreader/) also following along. [Thousands of subreddits partook in a protest](https://www.forbes.com/sites/antoniopequenoiv/2023/06/13/reddit-stands-by-controversial-api-changes-as-subreddit-protest-continues) but with no sign of the Reddit leadership reversing the changes (or at least adjusting them... paid API isn't unreasonable!). Therefore, I am going to quit the site (oh no! what will they do without my doom-scrolling) but first I will completely wipe my profile.

The way reddit handles account deletion means that the username is essentially disassociated from the content it has provided. This means that reddit essentially still has all your data on its site. Thus, this quick tutorial will show you how to delete your posts and your comments. After that, you can rest easy knowing that your years of shitposting aren't going to give reddit another penny.

## Pre-requisits

1. You must have the reddit enhancement suite installed
    - [Firefox](https://addons.mozilla.org/en-GB/firefox/addon/reddit-enhancement-suite/)
    - [Chrome](https://chrome.google.com/webstore/detail/reddit-enhancement-suite/kbmfpngjjgdllneeigpgjifpgocmfgmb)
    - [Edge](https://microsoftedge.microsoft.com/addons/detail/jlhgedjpndhblehblebhncfmkkpngiep)
2. I'm now assuming that you are using the `old.reddit.com` site

## How-To

The below works on both the [submitted](https://old.reddit.com/user/me/submitted) and [comments](https://old.reddit.com/user/me/comments) pages.

1. Open the developer console with `F12`
2. Paste the following javascript and press enter

```js
var $delButtons = $('.del-button .option .yes'), currentTime = 0;
$delButtons.each(function() {
    var _this = $(this);
    currentTime += 500;
    setTimeout(
        function() {
            _this.click();
        },
        currentTime);
    }
);
```

Once you get to the end of the page, refresh and go again!

**Note:** from my experience, older content might take a while to show up. Once you think you have deleted everything, give it a minute and double check!