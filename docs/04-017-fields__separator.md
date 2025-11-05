Display a simple separator.

```ts
import { separator, richText, text } from '@bienbien/rime/fields';
import { Collection } from '$rime/config';

const Pages = Collection.create('pages', {
  fields: [
    text('title').isTitle(),
    separator(),
    richText('content')
  ]
})
```
