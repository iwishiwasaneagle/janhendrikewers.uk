---
layout: post
title: Exploring Faster Alternatives To np.clip 
date: '2023-01-24'
categories: post
usemathjax: true
tags:
  - numpy 
  - python
  - optimisation
---

I was profiling some code I had written where `np.clip` was being called a couple hundreds of millions of times. The profiler was flagging some weird related functions that seemed unimportant so I delved deeper. Turns out that as of numpy 1.17, the `np.clip` has been substantially slower than previously which has been documented [here](https://github.com/numpy/numpy/issues/14281). This caught my curiosity and after some experimentation I found two substantially faster methods which in turn sped up my code by $50\%$!

Below is my log of what I tried, but if you just want results then [here](#conclusion) is your link.

**Note**: These tests were undertaken using numpy version `1.23.5`.

## Scalar

```python
VMIN = -0.5
VMAX = 0.5
X_scalar = 2 * np.random.rand() - 0.5
```

```python
np.clip(X_scalar, -0.5, 0.5)
> 11.3 µs ± 202 ns per loop (mean ± std. dev. of 7 runs, 100,000 loops each)
```

Testing the baseline gave us a fairly decent time of $11.3\mu s$.

```python
np.core.umath.maximum(np.core.umath.minimum(X_scalar, VMAX), VMIN)
> 2.25 µs ± 64.6 ns per loop (mean ± std. dev. of 7 runs, 100,000 loops each)
```

However, we quickly got huge gains by using max/min functions directly.

```python
np.max([np.min([X_scalar, VMAX]), VMIN])
> 8.74 µs ± 141 ns per loop (mean ± std. dev. of 7 runs, 100,000 loops each)
```

Using the normal max/min functions proved still faster but not nearly as fast as calling the `umath` functions directly.



```python
VMIN if X_scalar < VMIN else VMAX if X_scalar > VMAX else X_scalar
> 75.2 ns ± 7.8 ns per loop (mean ± std. dev. of 7 runs, 10,000,000 loops each)
```

For scalars, there is not much faster than direct logic in python it seems. Huge gains!


## Array

```python
X_array = 2 * (np.random.rand(50000) - VMAX)
```
Again, testing the baseline:
```python
np.clip(X_array, VMIN, VMAX)
> 172 µs ± 646 ns per loop (mean ± std. dev. of 7 runs, 10,000 loops each)
```

This gave us a very slow time of $172\mu s$ which isn't good enough. Since using the usual min/max functions proved fruitless in the scalar case, we skip it here.

```python
np.core.umath.maximum(np.core.umath.minimum(X_array, VMAX), VMIN)
> 40.9 µs ± 388 ns per loop (mean ± std. dev. of 7 runs, 10,000 loops each)
```

Again, the `umath` functions were faster.

```python
np.asarray([VMIN if Xi < VMIN else VMAX if Xi > VMAX else Xi for Xi in X_array])
> 10 ms ± 140 µs per loop (mean ± std. dev. of 7 runs, 100 loops each)
```

And (as expected honestly) the raw python variation was horribly slow.

## Conclusion

For scalars, using `VMIN if X < VMIN else VMAX if X > VMAX else X` is 150x faster than normal `np.clip`. However, using raw python for arrays is (expectedly) horrible. For this case, using `np.core.umath.maximum(np.core.umath.minimum(X, VMAX), VMIN)` is roughly 4x faster than `np.clip`.

### Credit 

I got most of these ideas from [numpy#14281](https://github.com/numpy/numpy/issues/14281) but wanted to verify them for myself.
