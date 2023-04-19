---
layout: post
title: Useful LaTex One-Liners For Reports/Papers/Etc.
date: 2023-04-19 15:02 +0100
categories: post
usemathjax: false
description: A handful of useful command line one-liners to help you write in LaTex. For example, word counts or ensuring unqiue labels.
tags:
    - LaTex
    - CLI
    - Tools
---

Some useful LaTex one-liners that I've accumulated over the years. You can also find these tools [here](https://gist.github.com/iwishiwasaneagle/2f91f63f3cb0107b94b501aa284a18ca)

## Show all errors, warnings, and undefined messages

Very basic but useful to analyse a log file after compilation with location in log file for further analysis

```bash
grep -iHEn "error|warning|undefined" *.log
```

## Find all the duplicated labels in a directory

Useful if referencing a figure results in warnings/errors

```bash
grep -ERh "\\\\label\{\w*:\w*\}" --include="*.tex" \
     | tr -d " " | sort | uniq -c | awk '$1>1 {print $0}'
```

## Validate references.bib

We use [Pezmc/BibLatex-Check](https://github.com/Pezmc/BibLatex-Check) for this one.

```bash
curl https://raw.githubusercontent.com/Pezmc/BibLatex-Check/master/biblatex_check.py \ 
    2>/dev/null | python - \ 
    -b $(find ./ -maxdepth 1 -name "*.bib" | head -n1) \ 
    -a $(find ./ -maxdepth 1 -name "*.aux" | head -n1)
```

## Find all the unused labels

Calling this one a "one-liner" is pushing it, but it's very useful nonetheless so it's being included.

```bash
REF=($(IFS=;grep -ERoh "\\\\\w*ref\{\w*:\w*\}" . | sort | uniq | awk -F{ '{print $2}' | tr -d '}'))
LABEL=($(IFS=;grep -ERoh "\\\\label\{\w*:\w*\}" . | sort | uniq | awk -F{ '{print $2}' | tr -d '}'))
for i in $LABEL
do
    echo $REF | grep -iq " $i "
    if [[ $? -eq 1 ]]
    then
        printf "\033[0;31mUNUSED LABEL: \033[0;32m$i\033[0m\n"
    fi
done
```

## Get document (rough) word count

This doesn't exclude referencing etc. but accurate enough for rough estimates.

```bash
pdftotext main.pdf - | \
    grep -ohE "\b[a-zA-Z]{2,}\b" | \
    tr '[:upper:]' '[:lower:]' | \
    sort | uniq > /tmp/words.txt; pdftotext main.pdf - | \
    grep -ohFf /tmp/words.txt | wc -w
```

## Spell check

Requires `aspell-en`.

1. Non-interactive - list of misspelled words
    - `pdftotext main.pdf - | grep -ohE "\b[a-zA-Z]{2,}\b" | tr '[:upper:]' '[:lower:]' | sort | uniq | aspell list -t | sort | uniq -c`
2. Interactive spell-check - file by file
    - `aspell -c -t main.tex # Replace main.tex with whatever tex file you're checking`
