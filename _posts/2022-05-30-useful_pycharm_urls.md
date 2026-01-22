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

| Library      | Module     | URL                                                                                                   |
| ------------ | ---------- | ----------------------------------------------------------------------------------------------------- |
| Numpy        | numpy      | <https://docs.scipy.org/doc/numpy/reference/generated/{element.qname}.html>                           |
| Scipy        | scipy      | <https://docs.scipy.org/doc/scipy/reference/generated/{element.qname}.html>                           |
| Scikit-Learn | sklearn    | <https://scikit-learn.org/stable/modules/generated/{element.qname}.html#{element.qname}>              |
| Pandas       | pandas     | <https://pandas.pydata.org/pandas-docs/stable/generated/{element.qname}.html>                         |
| Matplotlib   | matplotlib | <http://matplotlib.org/api/{module.basename}_api.html#{element.qname}>                                |
| Seaborn      | seaborn    | <https://seaborn.pydata.org/generated/{module.name}.{element.name}.html#{module.name}.{element.name}> |

## How

1. Go into your settings
2. Navigate to `Tools | External Documentation`
3. Press `+`
4. Input the module name and url from above

## Contribute

If you have any useful URLs that you'd like added, please say so in the comments below!
