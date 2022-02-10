---
layout: post
title: How To Easily Export Figures From Your Jupyter Notebooks
date: "2022-02-10"
categories: post
tags:
  - jupyter
  - python
---

Have a nice jupyter notebook with many many figures and don't want to `right click -> save` every single one? Well [nbconvert][nbconvert] to the rescue (sort of).

`nbconvert` lets you convert your notebooks to other formats, but some formats don't allow embedded images. So, to extract images we use a format that needs them to be stored as separate files.

```bash
python -m jupyter nbconvert --to markdown my_notebook.ipynb
[NbConvertApp] Converting notebook my_notebook.ipynb to markdown
[NbConvertApp] Support files will be in my_notebook_files/
[NbConvertApp] Making directory my_notebook_files
[NbConvertApp] Writing 288 bytes to my_notebook.md

$ ls my_notebook_files
my_notebook_1_0.png
```

Make sure to clean up the `.md` files afterwards!

## Example

Here's a simple `y=sin(x)` example. If I had plotted at a higher dpi with `fig, ax = plt.subplots(dpi=300)`, the exported image would be better. The *embedded* example is just a simple screenshot.

{:.centre}
![before](/static/img/2022-02-10-export_images_from_jupyter_notebook/before.png){:class="img-responsive"}
*Embedded Image*

{:.centre}
![before](/static/img/2022-02-10-export_images_from_jupyter_notebook/after.png){:class="img-responsive"}
*After export*




[nbconvert]: https://nbconvert.readthedocs.io/en/latest/