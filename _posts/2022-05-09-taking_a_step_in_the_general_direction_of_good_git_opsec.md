---
layout: post
title: Taking A Step In The General Direction Of Good Git OpSec
date: '2022-05-09'
categories: post
tags:
  - github
  - opsec
---

Every morning I tend to browse a few feeds: [r/programming](reddit.com/r/programming), [r/linux](reddit.com/r/linux), and [Github Trending](https://github.com/trending). That's how I stumbled across [ggshield](https://github.com/GitGuardian/ggshield) and as a result, also [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/).
I decided to sign up for GitGuardian to see if it'd find anything feeling quite confident. Quickly my hubris was shattered with **31 open secrets**!

Now, full disclosure, 13 of the 31 secrets were in a repository that a friend added me to for some help and another 15 were in private repositories. However, I would consider myself very careful with what I commit so this number was still quite shocking.

## The Remedy

I had a quick look into every _incident_ to see if it actually required attention. One stood out and I cannot believe I did this... I committed my SSH private key.

Some credit where it's due though, the commit message when deleting it was "jan you're a moron" and I must have generated a new private key when I realized. Nonetheless, why I didn't look into cleaning the commit message is beyond me so let's look into that now.

I previously mentioned the  BFG Repo-Cleaner so I quickly installed that with `yay -S bfg`. Looking at `bfg -h` I see

```bash
--delete-folders <glob>  delete folders with the specified names (eg '.svn', '*-tmp' - matches on folder name, not path within repo)
```

which is PERFECT.

Quickly `git clone --mirror REPO_URL` (the `--mirror` is very important) and cd into the project dir. I ran `bfg --delete-folders "ssh" ./` followed by `git reflog expire --expire=now --all && git gc --prune=now --aggressive` (this big command is printed at the end of the bfg logs to ensure the updates are propagated). One final command, `git push`, and now _hey presto_ it's gone!

## Post Mortem

I learnt a few things today:

1. No matter how careful I think I am being, I'm only human and will probably `git add` something unsavoury without thinking about it.
2. Monitor, monitor, and monitor. You can't catch something if you're not looking for it.

Yes the private key had been changed but it might still be listed as an authorized key on another server. You just don't know and as such, being proactive about it and cleaning your git history is probably a good idea.
