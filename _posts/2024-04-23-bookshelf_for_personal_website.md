---
layout: post
title: 'Enhance Your Website with a Functional CSS Bookshelf'
date: 2024-04-23
categories: post
usemathjax: false
description: 'Want a dynamic website addition? Build a customizable bookshelf with CSS, Javascript, and HTML! CSS lets you style it, Javascript adds interactivity, and HTML provides structure. Play with colors, patterns, and hover effects. Easy to populate shelves with your favorite titles. Craft a unique and engaging website element!'
tags:
    - CSS
    - VanillaJS
    - HTML
---

Building a website allows you to showcase your skills and interests, but sometimes, a static page can feel impersonal.  One way to add personality and visual interest is by incorporating a bookshelf element.  This blog post will guide you through creating a functional bookshelf using CSS (`bookshelf.css`), JavaScript (`bookshelf.js`), and HTML (`index.html`).

The source files can be found at [iwishiwasaneagle/virtual-bookshelf](https://github.com/iwishiwasaneagle/virtual-bookshelf) and an implementation can be found at [iwishiwasaneagle/janhendrikewers.uk](https://github.com/iwishiwasaneagle/janhendrikewers.uk) or at [petargyurov/petargyurov.github.io](https://github.com/petargyurov/petargyurov.github.io) without lazy-loading.

## Step 1: Defining the Bookshelf with CSS

The `bookshelf.css` file is the heart of the visual style.  Here, you'll define the look and feel of every bookshelf component, from the shelf itself to the individual books. The provided code offers a starting point, allowing you to customize the appearance to match your website's overall design.

The CSS uses CSS variables (`--pyramid`, `--stairs`, etc.) to define different spine patterns.  These variables are easily interchangeable, allowing you to experiment with various looks without modifying large sections of code. Here's an example snippet showcasing a variable definition and its usage:

```css
:root {
  --pyramid: linear-gradient(
    315deg,
    transparent 75%,
    rgba(255, 255, 255, 0.1) 0
  ),
  linear-gradient(
    45deg,
    transparent 75%,
    rgba(255, 255, 255, 0.1) 0
  ),
  linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.2) 166px,
    transparent 0
  ),
  linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.1) 75%,
    transparent 0
  );
  background-size: 20px 20px;
}

.spine {
  background-image: var(--tartan); /* Uses the --tartan variable */
}
```

## Step 2: Building the Bookshelf Structure with HTML

The `index.html` file serves as the foundation for your webpage and defines the basic structure of the bookshelf.  The provided code includes the structure for a single book, but you can easily duplicate this structure to populate your shelf with as many books as you'd like.

Each book is constructed using HTML's `div` element.  These nested elements define the various parts of the book, including the cover, spine, top, and even designated areas for the title and author. Here's an example snippet showing the HTML structure for a single book:

```html
<div class="book">
  <div class="side spine">
    <span class="spine-title">Blade Runner</span>
    <span class="spine-author">RS</span>
  </div>
  <div class="side top"></div>
  <div class="side cover" img="https://janhendrikewers.uk/static/img/bookshelf/1.jpg"></div>
</div>
```

## Step 3: Adding Interactivity with JavaScript

The `bookshelf.js` file injects functionality into your bookshelf, making it more engaging for visitors. The provided script accomplishes two key tasks:

1. **Randomizing Book Appearance:**  This script adds variety to your bookshelf by assigning random heights, patterns (for the spine), and colors to each book. This creates a more dynamic and visually interesting display.
2. **Lazy Loading Book Covers:**  This is a performance optimization technique.  The script delays loading the book cover images until the user hovers their mouse over a specific book. This can significantly improve the initial load time of your webpage, especially if you have many books with large cover images.

Here's an example snippet demonstrating how the script retrieves CSS variables and assigns random values:

```javascript
let availablePatterns = ["argyle", "tartan", "stairs", "pyramid"];

spines.map(function (s, i) {
  let randomPattern = randomChoice(availablePatterns);
  s.style.backgroundImage = `var(${randomPattern})`;
});
```

## Step 4: Integrating the Files

Now that you have an understanding of what the different files do, it's time to connect them and bring your bookshelf to life! This is a highly application-specific process so I would recommend taking what you need from the below files:

- [bookshelf.css](https://github.com/iwishiwasaneagle/virtual-bookshelf/blob/main/bookshelf.css)
- [bookshelf.js](https://github.com/iwishiwasaneagle/virtual-bookshelf/blob/main/bookshelf.js)
- [index.html](https://github.com/iwishiwasaneagle/virtual-bookshelf/blob/main/index.html)

This what how I did [mine](https://janhendrikewers.uk/bookshelf) using jekyll and a [`bookshelf.csv`](https://github.com/iwishiwasaneagle/janhendrikewers.uk/blob/master/_data/bookshelf.csv) file: [bookshelf.html](https://github.com/iwishiwasaneagle/janhendrikewers.uk/blob/master/_layouts/bookshelf.html)

