If you’ve followed the [installation](/docs/installation) steps correctly, you should already have a `pages` collection and the `$database` property set up.

The configuration is the core of **Rime**, this is where you define how your documents will be structured, localization, panel access configuration, custom API routes and [more](#properties)… The configuration entry **must be located at **`src/lib/config/rime.config.ts`. Here is a basic configuration example :

```ts
// src/lib/config/rime.config.ts
import { buildConfig, Collection } from '$rime/config';
import { text } from '@bienbien/rime/fields';

const Pages = Collection.create('pages', {
  fields: [
    text('title').isTitle().required(),
  ]
});

export default buildConfig({
  $database: 'my-app.sqlite'
  collections: [Pages]
});
```

> **ℹ️ Info**
> Note that **server-only properties** are declared with the `$` prefix. This is because the configuration will be split into a client and server versions, **generated in the **`$lib/+rime.generated`** folder (location may change, but this setup ensures relative imports remain intact).**

## Document prototypes

There are two document prototypes : collections and areas. Collections are repeatable content type e.g. users, pages, products…, and areas are singletons e.g. navigation, footer, information…

```ts
import { Collection, Area } from '$rime/config';
import { text, toggle } from '@bienbien/rime/fields';

const Settings = Area.create('settings', {
  fields: [
    toggle('maintenance')
  ]
});

const Pages = Collection.create('pages', {
  fields: [
    text('title').isTitle().required()
  ]
});
```

[resource:Areas::Create singleton content type::(http://localhost:5173/docs/configuration/areas)]

[resource:Collections::Create flexible structures for your content.::(http://localhost:5173/docs/configuration/collections)]

## Properties

| Property | Type | Description |
| --- | --- | --- |
| $database {{!required!}} | string | The name of the database located in ./db |
| $smtp | SMTPConfig | Smtp configuration to enable the rime.mailer core plugin and Better-Auth email features. |
| $trustedOrigins | string[] |

More |

| $cache | CacheConfig | API cache configuration More |
| --- | --- | --- |
| $routes | Record<string, RouteConfig> | Custom API routes More |
| $custom | Record<string, any> | Custom object passed to the server-only config. |
| siteUrl | string | When defined, a preview button will be added on the panel dashboard header, pointing to this url. |
| collections | BuiltCollection[] | List of collection documents configuration. [More](/docs/configuration/collections) |
| areas | BuiltArea[] | List of areas documents configuration. [More](/docs/configuration/areas) |
| localization | LocalizationConfig | Define available locales for your content. [More](/docs/configuration/i18n) |
| staff | AdditionalStaffConfig | Additional config for panel users. More |
| panel | PanelConfig | Panel access options and specific properties. More |
| custom | Record<string, any> | Custom object for both client and server config additional values |
