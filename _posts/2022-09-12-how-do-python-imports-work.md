---
layout: post
title: One Python `Import` Quirk You Need to Know, Or Why The Heck Is That A Function?
date: "2022-09-12"
categories: post
tags:
  - python
  - imports
  - pain
---

Any budding python program has been there. You've just made a wonderful new project with an amazingly descriptive file structure! Well done you!

```
foo
├── bar
│   ├── bar.py
│   └── __init__.py
└── __init__.py
```

Now, `foo/__init__.py` is empty making foo a module, and since `foo/bar` also has a `__init__.py` file, it is a submodule. For the purposes of this little demonstration, the files are as follows:

```python
# foo/bar/__init__.py
from .bar import bar

# foo/bar/bar.py
"""
This is a really important module!
"""

def bar():
    print("Hello, World!")
```

Everything works real nicely except you find yourself needing to call `help()` on the `bar` sub-submodule (i.e. `foo.bar.bar` not `foo.bar.bar.bar`). How do we do this?

```python
>>> from foo.bar import bar

>>> help(bar)
Help on function bar in module foo.bar.bar:

bar()
```

Well, that was expected right? Let's try something different...

```python
>>> import foo.bar.bar

>>> help(foo.bar.bar)
Help on function bar in module foo.bar.bar:

bar()
```

Shoot! Same again.

How about...

```python
>>> import foo.bar as b

>>> help(b.bar)
Help on function baz in module foo.bar.bar:

baz()
```

You see what's going on here?

Because we've named our function the same as the submodule(yes, `bar.py` is being treated as a submodule within the submodule `bar`), and we're **OVERWRITING** the submodule's name in `foo/bar/__init__.py`, it's impossible to access anything within the submodule other than `bar()`. However, with an empty init file, we could have called help on the submodule as:

```python
>>> from foo.bar import bar

>>> help(bar)
Help on module foo.bar.bar in foo.bar:

NAME
    foo.bar.bar - This is a really import module!

FUNCTIONS
    bar()

FILE
    foo/bar/bar.py
```

## Key Takeaways

1. Don't create additional modules within your source code if not required. A good rule of thumb is that splintering your code into submodules is only necessary if a certain _chunk_ needs more than 1 file
2. If you need to make a submodule, then use a blank `__init__.py` file if possible
3. And if you have to do custom imports in your init file, and if you have to have a submodule called `bar`, then name the file `_bar.py` and the function something a little more creative such as `Bar`

And another top tip, make good use of the [`__all__`](https://docs.python.org/3/tutorial/modules.html#importing-from-a-package) variable.
