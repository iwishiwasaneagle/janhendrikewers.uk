---
layout: post
title: How To Never Miss The Aurora Borealis Again!
date: 2023-04-24 17:30 +0100
categories: post
usemathjax: false
description: Use a HTML website as your wallpaper to always stay informed on the northern lights forecast
tags:
    - automation
    - northern lights
---

{:.center}
**You can access the results of this blog [here](/aurora.html)**

I live in Scotland and I have been getting constant messages about the Northern Lights in the sky from my Mum. I **really** want to see them but have to travel out of the city to escape the light polution. I recently discovered that the National Oceanic and Atmospheric Administration (NOAA) have service that provideds up to date Aurora forecasts for both hemispheres:

- [Northern](https://services.swpc.noaa.gov/images/aurora-forecast-northern-hemisphere.jpg)
- [Southern](https://services.swpc.noaa.gov/images/aurora-forecast-southern-hemisphere.jpg)

This inspired me to make a dynamically updating wallpaper for my desktop. I see this multiple times a day so should never miss another aurora borealis!

## The Code

This is a really simple website that uses the `background` CSS properties to correctly display the image.

```html
<!DOCTYPE html>
<style>
body {
  background-image: url('http://services.swpc.noaa.gov/images/aurora-forecast-northern-hemisphere.jpg');
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: contain;
  background-position: center;
  background-color: black;
}
</style>
<html>
    <meta http-equiv="refresh" content="900">
</html>
```

The `<meta http-equiv="refresh" content="900">` ensures that the image is updated every 15 minutes.

## The Execution

Now set your wallpaper from a URL. This is easy to do on most machines:

- [Windows](https://www.intowindows.com/how-to-set-a-webpage-as-desktop-background-in-windows-10/)
- [Linux KDE](https://store.kde.org/p/1324580) (this is the one I use)
- [MacOS](https://www.simplehelp.net/2021/07/14/how-to-set-a-web-page-as-the-desktop-background-in-macos/)
- [All other OSes](https://letmegooglethat.com/?q=HTML+Wallpaper+For+My+OS)

## The Result

{:.centre}
![Screenshot of two monitors, one showing the Aurora forecast](/static/img/2023-04-24_aurora_wallpaper.png){:.img-responsive}
*Screenshot of my two monitors (left=landscape, right=potrait) showing the result*