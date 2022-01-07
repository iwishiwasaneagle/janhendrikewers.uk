---
layout: post
title: My literature workflow 1 month into my PhD d
date: '2022-01-07'
categories: post
tags:
  - paperless-ng
  - raspberry-pi
  - workflow
  - phd
---

I'm approaching the 1 month anniversary of starting my PhD 🥳. As I approach this seemingly insignificant milestone relative to the 3-year committent I have made to my project, I wanted to take some time to write about my paper reading workflow so far. This is most likely going to change down the line and having a blog post to come back to and compare will be really interesting for me.

{% include toc.md %}

## Software

Being a big nerd, I started out by researching what software I wanted to be using. Browsing [r/selfhosted](https://selfhosted.reddit.com) I came across paperless-ng and [set it up on a raspberry pi]({{ site.url }}{% post_url 2021-09-25-paperless-ng_on_localy_hosted_rpi %}). This gave me a really solid, externally accessible [^1] archival solution.

Next I needed to decided on a reference manager. In the past I have used Mendeley but it did a lot of things that I didn't like - such as not giving me a local copy to backup myself. I also considered EndNote but ultimately chose Zotero as it:

1. Stored the data locally for me to backup,
2. Offered off-site storage (like Mendeley and EndNote),
3. Has very good integration with Overleaf,
4. Provides a great plugin for easily saving references (like Mendeley and EndNote).

Now, I'm a sucker for a good kanban board. I've used Zube.io religiously for exam revision management in the past by assigning points to cards and keeping track of my work-rate when approaching deadlines. Also, it's free! I have tried other solutions like Trello, but Zube's customisability and ease of use always makes me come back.

{:.center}
![Obsidian](/static/img/2021-10-28-my_literature_review_workflow_so_far/obsidian.png){:class="img-responsive"}
*Obsidian graph view showing the connected networks of notes*

The final piece in the overly complicated puzzle of software is how to do the note taking. During my undergrad I used a grim concoction of OneNote, Google Keep, paper, Word Online, and more. However, during the setting up of this blog I've been smitten by markdown so I looked for markdown based note taking apps. My poison of choice was Obsidian with it's endless plugin support, and graph view (and boy do I love graph view!)[^2].

## Shut up and finally tell me about your workflow

Okay, okay enough about my reasoning for picking the software that I did. Let's get into the meat of it.

The way I've structured the process is very intuitive: **collecting** and **reading**.

### Collecting

![Collection workflow](/static/img/2021-10-28-my_literature_review_workflow_so_far/collect.svg){:class="img-responsive"}

As you can see from my amazing draw.io diagram above, `find` is the first step. This is literally just finding a paper on the topic at hand. If it's path planning, I go to [Google Scholar](https://scholar.google.com/) and type in "path planning". However, starting with a single paper is the best method I've found so far. Make sure this paper is actually worthwhile reading though, and you can do this by just skimming the abstract and conclusion. To find more papers, enter the paper's DOI/SSN/ISBN/etc. into [ResearchRabbit](https://researchrabbitapp.com/home) to see either all references or all citations. It's the latter that I love as it lets me see more recent papers! I'd wager that I have found about 80% of my papers through this method.

{:.center}
![Paperless dashboards](/static/img/2021-10-28-my_literature_review_workflow_so_far/research_rabbit.png){:class="img-responsive"}
*Research Rabbit showing all citations up to today for a paper from 2009*

{:.center}
![Paperless dashboards](/static/img/2021-10-28-my_literature_review_workflow_so_far/paperless.png){:class="img-responsive"}
*Paperless-ng dashboard with "scientific paper" document type filter*


{:.center}
![Zube Kanban](/static/img/2021-10-28-my_literature_review_workflow_so_far/zube.png){:class="img-responsive"}
*Zube.io kanban board keeping track of to-dos*

{:.center}
![Zotero](/static/img/2021-10-28-my_literature_review_workflow_so_far/zotero.png){:class="img-responsive"}
*Zotero reference manager showing archival numbers linked to paperless's ASN*

![Reading workflow](/static/img/2021-10-28-my_literature_review_workflow_so_far/reading.svg){:class="img-responsive"}

[^1]: With COVID slowly winding down (hopefully for good!), I'm expecting to be hybrid working from home and within the university. This meant being able to access my collection of papers from anywhere was paramount.
[^2]: I also considered Notion (but hated the UX and the fact that security was done via obfuscation) and Notable.
