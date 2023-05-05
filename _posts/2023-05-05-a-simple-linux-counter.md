---
layout: post
title: A Simple Linux Counter
date: 2023-05-05 15:54 +0100
categories: post
usemathjax: false
description: A very simple linux counter that persists over sessions
tags:
    - Linux
    - Scripting
---

I'm currently marking exams digitally. All the questions are merged into a single PDF so I wanted to count how many I had marked without manually going back through. I couldn't quickly find something on StackOverflow and that's how this very simple, but effective, counter came to be.

## The Code

Copy-paste the following or download it here: [`counter.sh`]({% link /static/other/counter.sh %})

```bash
FILE=~/.counter
if [ ! -f "$FILE" ];
then
    echo 0 > $FILE
fi
C=$(($(cat $FILE)+1)) 
echo $C > $FILE
OUTPUT=$(notify-send "Counter incremented" $C -A reset='Reset counter')
if [ "$OUTPUT" == "reset" ]
then
    rm $FILE
    notify-send "Counter has been reset"
fi
```
