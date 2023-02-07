---
layout: post
title: Pip Install From Private GitHub Repos 
date: '2023-02-07'
categories: post
usemathjax: false
tags:
  - python 
  - pip
  - github
---

I'm currently working on a [library](https://github.com/iwishiwasaneagle/jdrones) that I'm not quite ready yet to open source. I use it for research, and as such need to be able to install it on other machines. Originally I was just cloning the repo and setting `PYTHONPATH` everywhere but this quickly became cumbersome. Below are the methods that I've discovered to install the library.

## HTTPS

So you don't want to set up SSH with a private key and all that jazz. Simply have a look at [this](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) guide to create a private access token (PAT) with **read** access to the private repo.

Then run the following

```bash
pip install git+https://$USERNAME:$PAT@github.com/$GH_USER/$REPO.git@$VERSION
```

Some other guides online either omit the $USERNAME because it's a new requirement or it used to work, but this is the only way it works for me these days **without** asking for my password.

## SSH

This is by far the easiest method, but it does require that [SSH is linked to your github account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh). If SSH is correctly set up, then run the following

```bash
pip install git+ssh://git@github.com/$GH_USER/$REPO.git@$VERSION
```

## Extra Info

- `$VERSION` can be a branch or tag
- PATs should **always** have the **minimum** permissions possible
  - GitHub's new [fine-grained tokens](https://github.com/settings/tokens?type=beta) give you per-repo control
- Treat your PATs like a password. DO NOT SHARE