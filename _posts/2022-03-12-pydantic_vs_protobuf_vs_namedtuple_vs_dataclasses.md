---
layout: post
permalink: pydantic_vs_protobuf_vs_namedtuple_vs_dataclasses.html
title: Pydantic vs Protobuf vs Namedtuples vs Dataclasses. Which Python Data Class Is Best?
description: Comparing four of the most well known pytho data class libraries for speed, serialization performance, and automatic data type conversion/checking.
date: "2022-03-22"
categories: post
tags:
  - python
  - pydantic
  - protobuf
  - performance
---

Before my introduction to [FastAPI](https://fastapi.tiangolo.com/) I was manually crafting classes to hold data. This was completely fine, but then [pydantic](https://pydantic-docs.helpmanual.io/) changed the way I thought about this. Who wants to write a custom `__init__` class for every data type, with type checking? However, over-time I've learnt some of it's limitations and other libraries such as [protobuf](https://github.com/protocolbuffers/protobuf) or [namedtuple](https://docs.python.org/3/library/collections.html#collections.namedtuple) kept cropping up. My hunger to over-complicate everything finally made me try them all out and this post is the result of that inability to KISS[^kiss].

{% include toc.md %}

## Experimental Setup

As I'm doing a lot of simulations in the near future, I decided to use two data types

1. Coord

   - Holds `x`, `y`, `z`, and `heading`
   - All of type `float`

2. Coords

   - Holds an unbounded list of `Coord`s under coords.

These were then instantiated with the _same_ random data using

```python
xs, ys, zs, heading = np.random.randint(0, 100, size=(4,15), dtype=int)
```

Note the `dtype=int`. This was done to test if the class do any type conversion (_spoiler:_ some do).

The variables in the following code examples have prefixes to show what library they are related to. `NT` is `namedtuple`, `DC` is `dataclasses`, `PD` is `pydantic`, and `PB` is `protobuf`. Easy.

## Creation

After creating the data models, as seen in the [appendix](#appendix), the classes were intialized. The method for `dataclasses`, `namedtuples` and `pydantic` were identical.

```python
def generate(t,f,g,h,i):
  return [t(x=fi.item(),y=gi.item(),z=hi.item(),heading=ii.item()) for fi, gi, hi, ii in zip(f, g, h, i)]

dccoords = DCCoords(coords=generate(DCCoord, xs, ys, zs, headings))
ntcoords = NTCoords(coords=generate(NTCoord, xs, ys, zs, headings))
pdcoords = PDCoords(coords=generate(PDCoord, xs, ys, zs, headings))
```

Protobuf was much different though. As can be seen on line 3 below, the coord is added to the list of coords, and then filled with values. This results in quite a bit more boiler plate code but if one knows about it, it's surprisingly readable.

{% highlight python linenos %}
pbcoords = PBCoords()
for xi,yi,zi,headingi in zip(xs,ys,zs,headings):
pbcoord = pbcoords.coords.add()
pbcoord.x = xi
pbcoord.y = yi
pbcoord.z = zi
pbcoord.heading = heading
{% endhighlight %}

## Type Conversions

All 4 data models were filled with int on purpose. `dataclasses`, `pydantic`, and `protobuf` have capabilities to define a data type for each field so those are the ones expected to convert the data _if possible_.

```python
isinstance(dccoords.coords[0].x, float)  # False
isinstance(ntcoords.coords[0].x, float)  # False
isinstance(pdcoords.coords[0].x, float)  # True
isinstance(pbcoords.coords[0].x, float)  # True
```

That's weird... `dataclasses` don't convert the field? Apparently this is expected behaviour and the suggested workaround is using a static type-checker like [`mypy`](https://mypy-lang.org/), [`pydantic.validate_arguments`](https://pydantic-docs.helpmanual.io/usage/validation_decorator/), or in the [`dataclass.dataclasses.__post_init__`](https://docs.python.org/3/library/dataclasses.html#post-init-processing) method.

`pydantic` and `protobuf` both convert the types which is nice. However, will this add much computational overhead?

## Instantiation Performance

One of the largest downsides of using a data class is the additional performance overhead. In my simulations, I run hundreds of thousands of trials with multiple thousand steps so any increase in computational time is noticed.

{:.centre}
![Speed comparison of instantiating the different python data classes](/static/img/2022-03-22-pydantic_vs_protobuf_vs_namedtuple_vs_dataclasses/speed.png){:class="img-responsive"}
_Mean time to instantiate a single `Coord` class in the respective libraries_

This is where we can really see the overhead of converting the types from `int` to `float` in `pydantic`. However, `protobuf` does not have nearly the same problems[^fw].

I'm honestly quite shocked at how well `protobuf` did. It's mean time was `685ns` whilst `namedtuple` achieved `608ns` and `dataclasses` did `643ns`.

## (De)serialization

### JSON

Another important aspect is storing my millions of data points. The "classic" method is via CSV or JSON. However, this struggles with multiple `Coords` so we'll give JSON a shot. Yes it's not meant for storing large series data but it's easy and available and probably what most people will turn to. [Pickleing](https://docs.python.org/3/library/pickle.html) is another option but this does not create human readable output, nor does it store very well[^pickle-vs-json].

`dataclasses` were a weird one, because it required a custom JSON encoder. However, 5 lines of additional code isn't too bad in my opinion.

```python
import json
class EnhancedJSONEncoder(json.JSONEncoder):
        def default(self, o):
            if dataclasses.is_dataclass(o):
                return dataclasses.asdict(o)
            return super().default(o)

dccoords_json = json.dumps(dccoords, separators=(',', ':'),  cls=EnhancedJSONEncoder)
```

`namedtuple` was actually quite easy, using the inbuilt `_asdict()` method resulted in

```python
ntcoords_json = json.dumps(ntcoords._asdict(), separators=(',', ':'))
```

`pydantic` has a built in `json()` method so this was as easy as `pdcoords_json = dcoords.json()`.

`protobuf`, being different as per, required the import of `MessageToJson`:

```python
from google.protobuf.json_format import MessageToJson
pbcoords_json = MessageToJson(pbcoords,indent=0).replace("\n","")
```

All serializations were more or less identical _except_ for `namedtuple`. For whatever reason the list of `NTCoord`s was serialized into a 2D array. Hopefully this won't cause any issues with the de-serialization (foreshadowing much?)

```json
{
  "coords": [
    [13, 37, 45, 90],
    [93, 44, 55, 54],
    [41, 50, 74, 34],
    [85, 59, 57, 85],
    [79, 85, 92, 58],
    [47, 26, 0, 30],
    [89, 24, 81, 65],
    [23, 71, 30, 54],
    [78, 79, 74, 97],
    [28, 30, 61, 56],
    [51, 72, 92, 7],
    [74, 49, 72, 64],
    [5, 14, 16, 42],
    [86, 93, 70, 77],
    [64, 55, 15, 35]
  ]
}
```

Deserializing from the JSON string showed pretty much exactly what I expected.

```python
DCCoords(**json.loads(dccoords_json)) == dccoords # False
NTCoords(**json.loads(ntcoords_json)) == ntcoords # False
PDCoords.parse_raw(pdcoords_json) == pdcoords     # True

from google.protobuf.json_format import Parse as JsonToMessage
JsonToMessage(pbcoords_json, PBCoords()) == pbcoords # True
```

`namedtuple` lost the data structure when it converted to JSON and `dataclasses` does not properly convert the types at instantiation. `pydantic` and `protobuf` both check what types every field was using and converts the data (correctly) back into that type.

### Smallest Possible

Whilst JSON is great for human-readable, easy-to-transfer data, it is not compact. For the next comparison where possible, the smallest representation was used. Deserialization was not considered as right now we're only concerned with storing large sets of data. Using it is someone else's job (usually me, in a few weeks time).

`protobuf` is the only non-JSON encoding. The inbuilt `SerializeToString` is very powerful and one of the core features of the library. Since the data class is compiled with a tool, and not just into python, it gives developers a huge advantage by easily creating highly optimized **cross-platform** data.

{:.centre}
![Size comparison of the various serialized python data classes](/static/img/2022-03-22-pydantic_vs_protobuf_vs_namedtuple_vs_dataclasses/size.png){:class="img-responsive"}
_Size of the compressed data for a `Coords` class from the respective libraries_

Evidently `pydantic` is the "worst". However, is it? `dataclasses` never converted the data to a float and as such, the raw JSON string will be missing the `.0`. With `2*4*15=120` bytes of missing data, the two are actually equal (`549+120 == 669`).

Next, why is `namedtuple` better than `protobuf`? Isn't protobuf "oh so highly optimized"? Well yes, but if we recall from the JSON serialization results, `namedtuple` just bungs the data into a 2D array and cannot deserialize it properly. A 2D array will always be smaller than a data structure that tries to save as much data about the object as possible. The JSON output for `dataclasses`, `pydantic`, and `protobuf` were close to identical, so a `2x` improvement is very impressive.

## Conclusion

To your dismay, there is no easy conclusion. I have fallen in love with the idea of using `protobuf`s, but the overhead of compilation and the weird method of creating the classes is quite off-putting. The speed and serialization benefits over the other 3 cannot be played down though.

`pydantic` performed shockingly bad, but the strict type checking and ease of use will have me coming for less performant instances.

The benefits of `dataclasses` and `namedtuples` are as they've always been: both are shipped with [`cpython`](https://github.com/python/cpython/blob/3.10/Lib/dataclasses.py) and are sufficient. `namedtuples` can be created in one line and allow easy to read code, whilst `dataclasses` are more akin to `pydantic` but require more setup.

I hope this investigation into the 4 main data class libraries in Python have helped you. If you have any libraries you think I should have included, please let me know in the [comments](#comments)!

## Appendix

<script src="https://gist.github.com/iwishiwasaneagle/fd304f7d951aa6ebeb13b5715f7a6410.js"></script>

---

[^fw]: This might call for more investigation in the future if this article does well.
[^pickle-vs-json]: For a more in-depth discussion between pickle vs json, have a look [here](https://docs.python.org/3/library/pickle.html#comparison-with-json).
[^kiss]: Keep It Simple, Stupid.
