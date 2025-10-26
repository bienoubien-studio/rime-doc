Fields are the way you define the structure of your documents. From simple text to nested arrays, blocks, rich-text, relations, … Rime provide a wide variety of fields to customise your content, and if you need more, creating custom fields is also possible.

Example fields definition for a `posts` collection :

```ts
const posts = Collection.create('posts', {
  fields:[
    tabs(
      tab('attributes').fields(
    	text('title').required().isTitle(),
    	slug('slug').required().slugify('attributes.title'),
        relation('thumbnail').to('medias')
      ),
      tab('content').fields(
        richText('text').features(heading(2,3,4), bold(), link(), medias())
      ),
      tab('seo').fields(
        text('title').hint('The title present in the browser tab'),
        text('description').hint('Text displayed in search results, about 120 characters max.'),
      )
    )
  ]
})
```

[resource:pages:Fields overview](/docs/04-00-fields.md)

## All fields
[resource:pages:blocks](/docs/04-01-fields__blocks.md)
[resource:pages:checkbox](/docs/04-02-fields__checkbox.md)
[resource:pages:combobox](/docs/04-03-fields__combobox.md)
[resource:pages:component](/docs/04-04-fields__component.md)
[resource:pages:date](/docs/04-05-fields__date.md)
[resource:pages:email](/docs/04-06-fields__email.md)
[resource:pages:group](/docs/04-07-fields__group.md)
[resource:pages:link](/docs/04-08-fields__link.md)
[resource:pages:number](/docs/04-09-fields__number.md)
[resource:pages:radio](/docs/04-10-fields__radio.md)
[resource:pages:relation](/docs/04-11-fields__relation.md)
[resource:pages:rich-text](/docs/04-12-fields__rich-text.md)
[resource:pages:select](/docs/04-13-fields__select.md)
[resource:pages:separator](/docs/04-14-fields__separator.md)
[resource:pages:slug](/docs/04-15-fields__slug.md)
[resource:pages:tabs](/docs/04-16-fields__tabs.md)
[resource:pages:text](/docs/04-17-fields__text.md)
[resource:pages:textarea](/docs/04-18-fields__textarea.md)
[resource:pages:time](/docs/04-19-fields__time.md)
[resource:pages:toggle](/docs/04-20-fields__toggle.md)
[resource:pages:tree](/docs/04-21-fields__tree.md)
