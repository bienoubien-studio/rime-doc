To enable content localization define the localization property like so :

```ts
// src/lib/+rime/rizom.config.ts
export default rime({
	//...
	localization: {
		locales: [
			{ code: 'fr', label: 'Français'},
			{ code: 'en', label: 'English'}
		],
		default: 'fr'
	}
});
```
