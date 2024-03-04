---
layout: post
title: 'Optimising Search and Rescue: How Algorithms Could Outperform Human Pilots'
date: 2024-02-23
categories: post
usemathjax: false
description: 'Exploring our research into how drones and algorithms could reshape search and rescue operations in Scotland.'
tags:
    - Search and Rescue
    - UAV
    - Research
scholar:
  bibliography: 2024_02_23.bib
  bibliography_list_tag: ol
  details_link: false
---

_This article is a short dive into a recent journal publication of mine titled [Optimal Path Planning Using Psychological Profiling in Drone-assisted Missing Person Search](https://doi.org/10.1002/adc2.167)._

---

Search and Rescue (SAR) operations are inherently time-sensitive endeavors,
 and this urgency amplifies when it involves locating vulnerable missing individuals like children or elderly people suffering from dementia.
Classic search operations involve hundreds, if not thousands, of man-hours combing landscapes or mind-boggingly expensive helicopters doing the same. This is where the drone steps in. It has the height-advantage of the helicopter without the associated costs. For these reasons,  Scottish Mountain Rescue (SMR) and Police Scotland Air Support Unit (PSASU) have started experimenting with their use within search. 

Whilst modern control systems make drones flyable by just about anyone, the route flown given the reduced flight time is highly critical. A more optimal coverage of the area means a higher chance of finding the missing person. This is what we have explored in our recent research; can a computer perform this task? To answer this question we pitted a PSASU pilot versus a computer in a mock SAR mission. Our results show that the computer can outperform a skilled police officer.

Firstly, how does the drone know where to look? This part is done by modelling the probability of finding a missing person at a point by a Probability Distribution Map (PDM). This is quite literally a black and white image, where regions of higher probability are indicated by a lighter colour. _Lost person behavior_ by Rober Koester provides key data-based insights into the physcological profile of a missing person, and how they are likely to behave. This allows us to create the PDM manually by identifying that, for example, a tree is present which a hiker is likely to stop at.

<style>
figure
{
    display: inline-block;
    width: 33%;
    vertical-align:top;
}
</style>
<figure>
    <img src='/static/img/2024-02-23-optimising-search-and-rescue/prob_map_8_jackton_map.png' width='100%' alt='Base-map' />
    <figcaption><i>Satellite image showing a field with trees and bushes. Note that the buildings were off-limits for the testing.</i></figcaption>
</figure>
<figure>
    <img src='/static/img/2024-02-23-optimising-search-and-rescue/prob_map_8_jackton.png' width='100%' alt='PDM' />
    <figcaption><i>An manullay created PDM highlighting the cluster of bushes in the south-east.</i></figcaption>
</figure>
<figure>
    <img src='/static/img/2024-02-23-optimising-search-and-rescue/prob_map_8_jackton_overlay.png' width='100%' alt='PDM overlayed onto base-map' />
    <figcaption><i>The PDM overalyed ontop of the base-map</i></figcaption>
</figure>

The next step is defining the optimisation problem over the area. We do this by rewarding the accumulation of probability under the search footprint. This also discourages revisiting _seen_ areas as there is no new probability to accumulate. Both the genetic algorithm and particle swarm optimisiation were compared against one-another, with Probability Accumulation-based Optimisation Genetic Algorithm (PABO GA) being the winner.

{:.centre}
![Flight paths](/static/img/2024-02-23-optimising-search-and-rescue/paths_ps.png){:class="img-responsive"}

In the figure, the flight paths from the test flights can be seen. Two flights were undertaken by the PSASU pilot, and a third that attempted to closely follow a parallel swaths (aka lawnmower) pattern.
The latter was done to demonstrate how hard it is for the pilot to closely follow a predetermined path, rather than simply exploring the area based on intuition.

{:.centre}
![A graph of the results](/static/img/2024-02-23-optimising-search-and-rescue/endurance_limited_time-to-find_ps.png){:class="img-responsive"}

Graph above clearly shows how PABO GA has a higher accumulated probability for the majority of the flight. Interstingly, all PSASU paths are very similar when viewed from this probability-based perspective. Even with varying flight times due to endurance limitations, both _PS ASU 1_ and _2_ finish at roughly the same total accumulated probability. 

In conclusion, this result is a clear indication that algorithms could improve the time to find a missing person and thus save lives. Whilst the experimental results are not concrete proof that humans are redundent, it does highlight the potential in fully autonomous drones used in real search missions. Future experiments should have a higher number of trials, with tighter coupling of the PDM to the pilot's intuition.

## References

{% bibliography %}