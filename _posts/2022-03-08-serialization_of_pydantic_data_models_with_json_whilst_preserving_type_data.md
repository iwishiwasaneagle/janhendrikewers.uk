---
layout: post
title: Serialization Of Pydantic Data Models With JSON Whilst Preserving Type Data
date: "2022-03-08"
categories: post
tags:
  - pydantic
  - python
---

I recently encountered an issue where I was relying on Pydantic to know what model I wanted it to *select* based on the parameters alone. This was fine until I started using models with the same parameters. Hopefully this short guide will quickly cover how to deal with this.

## The Problem

Let's quickly define the problem. We have a base-class `Base` which `A` and `B` inherits all their attributes from and does not add anything themselves. We then create another class `C` which houses either `A` or `B` in `C.baz`.

```python
class Base(pydantic.BaseModel):
    foo: float
    bar: float

class A(Base):
    pass

class B(Base):
    pass
        
class C(pydantic.BaseModel):
    baz: Union[A,B]
```

If we were then to serialize from pydantic to json, and then deserialize back from json to pydantic, an instance of `C` with `baz` holding a `B` object, the resultant `C` class would actually be holding a `A` object at `baz` after all is said and done. This is because json doesn't hold type information by design which forces Pydantic to pick either `A` or `B` based on order listed in the type definition.

```python
c = C(baz=B(foo=0.1, bar=0.2))

print(c.json()) # {"baz": {"foo": 0.1, "bar": 0.2}}

#                              The problem
#                                  \/ 
print(C.parse_raw(d.json())) # baz=A(foo=0.1, bar=0.2)
```

## The Solution

We need to define custom en- and de-coders to store type data along the actual data. Pydantic sadly does not handle this very elegantly so extra care needs to be take when using these methods within your codebase.

First, let's define the encoder that will store the class name as under `_type`.

```python
custom_encoder = lambda obj:  dict(_type=type(obj).__name__, **obj.dict())
```

We then add the [`json_encoders`](https://pydantic-docs.helpmanual.io/usage/exporting_models/#json_encoders) configuration to the model.

```python
class C(pydantic.BaseModel):
    baz: Base

    class Config:
        json_encoders = {
            Base: custom_encoder
        }

c = C(baz=B(foo=0.1, bar=0.2))
print(c.json(models_as_dict=False)) # '{"baz": {"_type": "B", "foo": 0.1, "bar": 0.2}}'
```

The next stage is the decoder. For this we turn to `json.JSONDecoder` and create a custom hook.

```python
class CustomDecoder(json.JSONDecoder):
    def __init__(self, *args, **kwargs):
        json.JSONDecoder.__init__(self, object_hook=self.object_hook, *args, **kwargs)
        
    def object_hook(self, obj):
        _type = obj.get('_type')
        if _type is None:
            return obj
        
        del obj['_type'] # Delete the `_type` key as it isn't used in the models
        
        mapping = {f.__name__:f for f in [A, B]} # Create a look-up object to avoid an if-else chain
        
        return mapping[_type].parse_obj(obj)
```

Then finally add it to the `C` model using `functools.partial`.

```python
class C(pydantic.BaseModel):
    baz: Base
        
    class Config:
        json_encoders = {
            Base: custom_encoder
        }
        json_loads = functools.partial(json.loads, cls=CustomDecoder)
```

## The Result

Finally we have a suitable method for serializing and de-serializing a custom object in a way that retains type data!

Below is a quick demonstration which shows how to use this method along with the [`models_as_dict=False`](https://pydantic-docs.helpmanual.io/usage/exporting_models/#serialising-self-reference-or-other-models) parameter.

```python
c = C(baz=B(foo=0.1, bar=0.2))
c_json = c.json(models_as_dict=False) # models_as_dict=False is VERY important! Excluding it will invalidate all of this.

#                              It works!
#                                \/ 
print(C.parse_raw(c_json)) # baz=B(foo=0.1, bar=0.2)

```

## Problems You Might Encounter

1. This won't work if the field uses a `Union` type. I don't know why, but it just doesn't. That is why I have set `baz: Base` rather than `baz: Union[A,B]`, where the latter is more readable in my opinion.
2. The output is less "pretty"
