An area is a singleton document type, defined by its `slug`, its fields and some properties. Based on those, API endpoints, types, and panel related pages are generated. Here is an example area : 

```ts
import { Area } from '$rime/config';
import { text, toggle } from '@bienbien/rime/fields';

const Settings = Area.create('settings', {
  fields: [
    text('siteTitle').required(),
    toggle('maintenance')
  ]
});
```

The slug, passed as the first argument of `Area.create` must be unique across all of your documents. 

## Properties



| fields {{!required!}} | FieldBuilder<Field>[] | Area fields definition |
| icon | Component<IconProps> | The area icon used inside the panel. Either a @lucide/svelte icon or a custom component with similar props. |
| versions | boolean | VersionsConfig | Document version configuration. More |
| access | Access | Access rules for this area. More |
| live | boolean | Whether a the document can be live edited. This require the `url` property to be defined. |
| panel | false | DocPanelConfig | Panel configuration : `panel.group` defines the navigation group, `panel.description` the description on the dashboard. |
| label | string | Area label |
| $hooks | AreaHooks | User defined hooks for operations fine grained control. |
| $url | Function | A function that get the document as argument and return a string. More |