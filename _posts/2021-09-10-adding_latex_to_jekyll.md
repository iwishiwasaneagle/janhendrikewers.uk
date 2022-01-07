---
layout: post
title: Adding LaTex to Jekyll
date: '2021-09-10'
categories: post
tags:
  - latex
  - jekyll
  - markdown
---

I'm about to start my PhD and a logical conclusion from that is that I will be writing a lot on LaTex. If I plan to write any blogs or such about the progress then this LaTex support is needed! Luckily for me [iangoodfellow](http://www.iangoodfellow.com/blog/jekyll/markdown/tex/2016/11/07/latex-in-markdown.html) has written a short guide on this already!

## TL;DR

Add the following code to `_layouts/post.html`:

```html
<script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML" type="text/javascript"></script>
```

**Note:** `cdn.mathjax.org` has been deprecated. Please use `cdnjs.cloudflare.com` as per https://www.mathjax.org/cdn-shutting-down/

Then you can write normal MathJax expressions such as

```latex
\vec{\alpha}
=
\begin{bmatrix}
    1 & 1 & 1 \\
    2 & 2 & 2
\end{bmatrix}
\cdot
\begin{bmatrix}
    4 \\
    2 \\
    0
\end{bmatrix}
$$
```

to get

$$
\vec{\alpha}
=
\begin{bmatrix}
    1 & 1 & 1 \\
    2 & 2 & 2
\end{bmatrix}
\cdot
\begin{bmatrix}
    4 \\
    2 \\
    0
\end{bmatrix}
$$

## Limitations

MathJax only supports the **core** LaTex functionality which means so ability to add packages with `usepackage`. Hence, iangoodfellow suggests using `boldsymbol` rather than `bm`. Furthermore, he says

> "There seem to be a few other rough edges, for example, LaTeX expressions seem to cause extraneous line breaks when used in blog post titles."

## Tips 'n' tricks

There's two resources I result on the regular when using Markdown and/or Latex:

1. [This Markdown cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) by `adam-p`
2. [This table generator](https://www.tablesgenerator.com/) to get plaintext, markdown, latex, etc. tables with formatting and more. Super useful.
3. [This MathJax cheatsheet](https://math.meta.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference) by `MJD`
