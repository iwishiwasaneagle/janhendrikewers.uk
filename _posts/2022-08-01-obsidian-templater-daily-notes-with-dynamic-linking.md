---
layout: post
title: Custom Obsidian Templater Daily Notes Template With Dynamic Linking 
date: "2022-08-01"
categories: post
tags:
  - obsidian
  - templater
  - js
  - automation
---

I've recently started using [Obsidian](https://obsidian.md/)'s Daily Notes feature to keep track of what I've been doing. From the start I wanted to use [Templater](https://silentvoid13.github.io/Templater) to dynamically create my daily notes such that **each note to link to the previous one**. And I'm not talking a simple `-1d` offset. I'm talking properly analysing the available files to then pick the most recent one akin to a [Singly Linked List](https://www.geeksforgeeks.org/types-of-linked-list/)

⚠️ First thing first, this isn't a Templater tutorial so head to the [documentation](https://silentvoid13.github.io/Templater/user-functions/overview.html) to learn how to do this yourself.

🧑‍💻 Go [here](#complete-files) for the complete code

## Implementation

Firstly, let's scrape the file system through the `app.vault` api and exclude any notes without `Daily Notes` folder and let's also exclude today's (hard-coded for now) notes name:

```javascript
  files = app.vault.getMarkdownFiles()
    .filter(file => file.path.includes("Daily Notes"))
    .filter(file => !file.path.includes("2022-08-01"));
```

Next we'll evaluate how long ago the file was created based on it's `basename`

```javascript
  now = Date.now().valueOf();

  files = files.map(file => {
    file.parsed_time = Date.parse(file.basename);
    return file;
  });
```

Finally we'll sort the array and select the most recent one
  
```javascript
  files = files.sort((a, b) => a.parsed_time < b.parsed_time);
```

## Template

Within a template we just call:

```md
<% tp.user.tag_previous_daily_note(tp.file.title, "YOUR DAILY NOTE PATH") %>
```

## Complete Files

`tag_previous_daily_note.js`

```javascript
function tag_previous_daily_note(filename, path) {

  files = app.vault.getMarkdownFiles().filter(file => file.path.includes(path)).filter(file => !file.path.includes(filename));

  now = Date.now().valueOf();

  files = files.map(file => {
    file.parsed_time = Date.parse(file.basename);
    return file;
  });

  files = files.sort((a, b) => a.parsed_time < b.parsed_time);

  return files[0].basename;
}

module.exports = tag_previous_daily_note;
```

`daily_notes_template.md`
```
---
created: <% tp.file.creation_date() %>
tags: daily/<% tp.date.now("YYYY/MMMM") %>
---

# <%tp.file.title%>
---

**Previous** [[<% tp.user.tag_previous_daily_note(tp.file.title,"Daily Notes")%>]]

---

<% tp.file.cursor(1) %>
```