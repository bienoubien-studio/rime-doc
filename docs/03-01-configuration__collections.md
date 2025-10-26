A collection is a repeatable document type, defined by its `slug`, its fields and some properties. Based on those, API endpoints, types, and panel related pages are generated. Here is an example collection :

```ts
import { Collection } from '$rime/config';
import { text, richText } from '@bienbien/rime/fields';
import { bold, link } from '@bienbien/rime/fields/rich-text';

const Posts = Collection.create('posts', {
  fields: [
    text('title').isTitle().required(),
    richText('content').features(bold(), link())
  ]
});
```

The slug that is passed as the first argument of `Collection.create` must be unique across all of your documents types.

## Properties

| Property | Type | Description |
| --- | --- | --- |
| fields {{!required!}} | FieldBuilder<Field>[] | Collection fields definition [More](/docs/04-00-fields.md) |
| icon | Component<IconProps> | The collection icon used inside the panel. Either a @lucide/svelte icon or a custom component with similar props. |
| versions | boolean &vert; VersionsConfig | Document version configuration. More |
| access | Access | Access rules for this collection. More |
| live | boolean | Whether a document from the collection can be live edited. This require the `url` property to be defined. |
| panel | false &vert; DocPanelConfig | Panel configuration : `panel.group` defines the navigation group, `panel.description` the description on the dashboard. |
| label | string &vert; CollectionLabel | Collection label |
| auth | boolean &vert; AuthConfig | Authentication configuration. More |
| $hooks | CollectionHooks | User defined hooks for operations fine grained control. |
| $url | Function | A function that get the document as argument and return a string. More |
| nested | boolean | Whether the collection has the nested feature enable. When enabled documents can have children and/or parent, this also enable tree reordering on the collection page |
| upload | boolean &vert; UploadConfig | When enabled, a collection document will have a file upload feature. More |
