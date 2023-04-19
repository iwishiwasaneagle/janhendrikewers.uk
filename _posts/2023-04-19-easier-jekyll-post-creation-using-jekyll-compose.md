---
layout: post
title: easier jekyll post creation using jekyll-compose
date: 2023-04-19 13:53 +0100
categories: post
usemathjax: false
description:
tags:
---

Today I learned about a handy tool for jekyll called [jekyll-compose](https://github.com/jekyll/jekyll-compose). This lets you automatically create post and draft files for jekyll with **generated front-matter**. This is a really cool tool and I'd reccommend anyone using jekyll to have a look!

Is it going to save you time? Probably not. Does it remove the nuissance of manually creating posts, and moving drafts about? Yes! What a treat.

## Installation

Add this to your `Gemfile`

```ruby
group :jekyll_plugins do
  gem 'jekyll-compose'
end
```

and run `bundle install`