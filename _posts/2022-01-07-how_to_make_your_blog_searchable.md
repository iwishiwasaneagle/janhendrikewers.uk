---
layout: post
title: How To Make Your Blog Searchable Using Algolia 
date: '2022-01-07'
categories: post
tags:
  - jekyll
  - search
---

I got bored today and decided I needed a tool to let readers search my {{site.posts | size}} blog posts. Writing my own backend API and such was too tedious so I got inspiration from the [Bootstrap docs](https://getbootstrap.com/docs/5.1/getting-started/introduction/) and decided to look into Algolia. Lukily for me, the kind folks at Algolia have already created a [Jekyll tool](https://github.com/algolia/jekyll-algolia) for me to use!

In this post I will talk you through my installation and implementation of Algolia.

{% include toc.md %}

## Backend

### Setup

Just add `jekyll-algolia` to your Gemfile like so

```ruby
group :jekyll_plugins do
  gem 'jekyll-algolia'
end
```

and run `bundle install`. The next step is to configure the plugin to work with the Algolia API in order to _index_ your posts. For this you have to provide your account credentials. Luckily for you there is a [free community tier](https://www.algolia.com/users/sign_up/hacker)!

You can find your credentials at [algolia.com/account/api-keys/](https://www.algolia.com/account/api-keys/) and place them into your `_config.yml`.

```yaml
algolia:
  application_id: your_application_id
  index_name:     jekyll # Customize
  public_key:     search_only_api_key
```

Another (optional) step is to exclude some files. The default behaviour is to index all markdown and html files. I chose to exclude a few by adding `files_to_exclude: ['blog.html', 'atom.html', 'index.html', '404.html']` to the `algolia` section of my `config.yml`. This allows me to only provide search in the blog posts on my website.

The next, and final step in the **backend** set-up, is to run `ALGOLIA_API_KEY='admin_api_key' bundle exec jekyll algolia`.

### Continuous Deployment

Running a single command every time there is a change to my blog is *tedious* and involves effort. So, as a good developer, I automatically want to automate as much as possible. Luckily, I've already set up a CD workflow on Github which makes this **very** easy for me. If you would like to do something similar, checkout my configuration file [here](https://github.com/iwishiwasaneagle/janhendrikewers.uk/blob/master/.github/workflows/cd.yml)

To implement the auto-indexing, I add

```yaml
- name: "Auto-index website"
  run: ALGOLIA_API_KEY=${{ secrets.ALGOLIA_ADMIN_KEY }} bundle exec jekyll algolia
```

to the end of my `Deploy` job, to ensure that the index is uploaded once everything is properly deployed.

## Frontend

Indexes are uploaded, the website is updated. Now the only thing that remains is implementing a functional search box... yikes. [`Autocomplete`](https://www.algolia.com/doc/ui-libraries/autocomplete/introduction/what-is-autocomplete/) is to the rescue!

### Installation

We'll use the [jsDeliver](https://www.jsdelivr.com/) CDN to install Autocomplete along with the classic theme:

```html
    <script src="https://cdn.jsdelivr.net/npm/algoliasearch@4.5.1/dist/algoliasearch-lite.umd.js" integrity="sha256-EXPXz4W6pQgfYY3yTpnDa3OH8/EPn16ciVsPQ/ypsjk=" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@algolia/autocomplete-js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@algolia/autocomplete-theme-classic"
    />
```

### Implementation

Next, initialize the library, with your Angolia account **PUBLIC API KEY** where ever makes sense. That location is `header.html` for me since my search box is/will be there.

{% raw %}
```html
<script>
  const searchClient = algoliasearch(
    '{{ site.algolia.application_id }}',
    '{{site.algolia.public_key}}',
  );
</script>
```
{% endraw %}

Next we must import Autocomplete with `const { autocomplete, getAlgoliaResults } = window['@algolia/autocomplete-js'];`.

Now we're ready to add the search box. Add a div with an id to your html, like `<div id='autcomplete'></div>`. This is where the search bar will be.

Back in your `<script>`, we add the bellow code:

{% raw %}
```js
autocomplete({
    container: '#autocomplete',
    placeholder: 'Search for posts',
  getSources({ query }) {
    return [
      {
        sourceId: 'posts',
        getItems() {
          return getAlgoliaResults({
            searchClient,
            queries: [
              {
                indexName: '{{ site.algolia.index_name }}',
                query,
                params: {
                  hitsPerPage: 5,
                  snippetEllipsisText: '…',
                },
              },
            ],
          });
        },
        templates: {
          item({ item, createElement, components }) {
            return createElement('div', null,
              createElement('a', { href: item.url, class: "text-decoration-none text-body" },
                components.Highlight({ hit: item, attribute: 'title', tagName: 'strong' })
              ),
            );
          },
          noResults(){
            return 'No Results';
          }
        },
      },
    ]
  }      
});
```
{% endraw %}

It may seem daunting at first, but the API is quite intuitive upon closer inspection. `getItem` gets the items, `templates` provides templates for how to return results, `noResults` is what shows when there are no results. The [documentation for Autocomplete](https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/basic-configuration-options/) is surprisingly good so do check it out, as anything I write here pales in comparison to their efforts.

## Conclusion

Algolia has built a very excellent set of tools for us casuals to play around with. There is no surprise why I'm seeing the "powered by Algolia" tag left, right and centre. I tried getting on the [DocSearch](https://docsearch.algolia.com/) program but was sadly rejected as they are prioritizing technical documentation websites first (see [Bootstrap](https://getbootstrap.com/docs)).

At the time of writing this post, I have 3 published blog posts so it works very well 100% of the time as all posts are being shown. It wil be interesting to see how my setup scales over time.

If you have any comments, questions, or queries, then please use the comment section below!
