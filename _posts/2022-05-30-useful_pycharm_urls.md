---
layout: post
title: External Library Documentation URLS for PyCharm
date: "2022-05-30"
categories: post
tags:
  - pycharm
  - jetbrains
  - python
---

Being able to hover over modules, classes, functions, etc. of a library and seeing the documentation is always great. This post acts as a resources for you to copy/paste the external documentation URL for your favourite libraries to enable this feature. For more information how to enable this, have a look [here](#how)

{% assign items = site.data.pycharm_urls %}
{% assign sorteditems = items | sort: 'Library' %}

<table>
    <tr><th>Library</th><th>Module</th><th>URL</th></tr>
  {% for row in sorteditems %}
    <tr>
    <td>{{ row.Library}}</td>
    <td><code>{{ row.Module}}</code></td>
    <td><code>{{ row.URL}}</code></td>
    </tr>
  {% endfor %}
</table>

## How

1. Go into your settings
2. Navigate to `Tools | External Documentation`
3. Press `+`
4. Input the module name and url from above

## Contribute

If you have any useful URLs that you'd like added, please say so in the comments below!
