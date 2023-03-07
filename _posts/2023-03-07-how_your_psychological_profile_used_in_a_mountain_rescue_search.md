---
layout: post
title: How Your Psychological Profile Used In A Mountain Rescue Search
date: '2023-03-07'
categories: post
usemathjax: true
tags:
  - SAR
  - data
  - mountain rescue
  - rambling
---

When you (or actually, anyone) gets lost in the mountains, a group of experts get called out with one task: find you, and get you back to safety. They use a myriad of tools to do this, with the one we'll focus on in this post being **data**.

---

> _Note: I'm not a mountain rescue expert, so everything written here should be taken with a pinch of salt._

---

You may not know this, but lost people behave massively different based on their gender, age, health, and current activity. We know this from historical data gathered over hundreds of Search and Rescue (SAR) incidents carefully catalogued and processed by various groups ([SMR](https://www.scottishmountainrescue.org/), [EWMR](https://www.mountain.rescue.org.uk/), Police, [ISRID](https://www.dbs-sar.com/SAR_Research/ISRID.htm), etc.). This data is usually very top-level, like how long they were travelling for, where they were found, how far from a road were they found, etc.

Using this, we can construct a model that matches as closely as possible to the data and through this predict where a person might be found from a report last place seen (LPS). This model may not be anything formal, but rather to inform the search leader about where their searches need to look. If profile A is likely to be near a lake, then look near the lake! If profile B is highly likely to not travel longer than 5 hours, restrict your search area. 

One data source that is commonly used throughout the UK is the _UK Missing Person Behaviour Study_ [^fn2]. This tells us that _Children aged 1 to 16 years_ have a $52\%$ chance of being found near building, and in comparison a person suffering from _Dementia_ is only found near buildings $26\%$ of the time[^fn1].

A caveat to this is that it's important to make the distinction between environment types. Someone lost in the Scottish Highlands will have a much harder time traversing the terrain, than someone lost in Yorkshire. As well as this, there is usually no distinction made on time-of-day or the weather conditions In the data. However, through chatting to mountain rescue experts from the Lake District[^fn3], they automatically search down-wind from the LPS as _who in their right mind walks into the wind when they're already struggling to locate themselves or injured_.

Whilst you may never use this information, I find it really interesting to know what tools are being used by the experts saving lives. My current research is in the field of predicting and searching for lost people using [drones](https://github.com/iwishiwasaneagle/jdrones), so it's nice to share a niche slither of my work.

---

> **N.B. (1)**: The mountains are a beautiful, yet dangerous place. Mountain rescuers literally put their life on line to help people on the regular with (usually) no compensation. In Scotland, the individual teams rely on donations as the funding from the government is marginal. So please be careful and don't take their efforts for granted.
>
> **N.B. (2):** If this blog post piqued your interest about the niche that is mountain rescue, the book _Cairngorm John: a Life in Mountain Rescue_ by John Allen is a fascinating insight into how search and rescue scenarios play out.

---

[^fn1]: This is for the _farmland_ terrain, and _female_ gender for the dementia category. The child 1-16 category does not report on gender.

[^fn2]: D. Perkins, P. Roberts, G. Feeney, and P. Mrt, ‘The U.K. Missing Person Behaviour Study’, CSR, 2011, [Online]. Available: https://tcsr.org.uk/media/kushuk1a/uk-missing-person-behaviour-study-2011.pdf

[^fn3]: Fun fact: Lake District Mountain Rescue don't just search for humans, but animals too!
