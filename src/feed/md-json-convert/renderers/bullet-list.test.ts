import { expect, test } from 'vitest';
import { markdownToJson } from '..';

const md = `- Built-in [i18n](/docs/03-04-configuration__i18n.md) support
- Version system
- A wide variety of [fields](/docs/04-fieds.md), including blocks and nested arrays
- A flexible, intuitive rich-text editor
- Headless architecture, so you can build your front-end without limitations
- Automatic API endpoint generation
- Great types supports, from your database schema to your front-end
- Smooth, developer-friendly workflow`;

const expected = [
	{
		content: [
			{
				content: [
					{
						content: [
							{
								text: 'Built-in ',
								type: 'text'
							},
							{
								marks: [
									{
										attrs: {
											class: null,
											href: '/docs/configuration/i18n',
											rel: 'noopener noreferrer nofollow',
											target: '_self'
										},
										type: 'link'
									}
								],
								text: 'i18n',
								type: 'text'
							},
							{
								text: ' support',
								type: 'text'
							}
						],
						type: 'paragraph'
					}
				],
				type: 'listItem'
			},
			{
				content: [
					{
						content: [
							{
								text: 'Version system',
								type: 'text'
							}
						],
						type: 'paragraph'
					}
				],
				type: 'listItem'
			},
			{
				content: [
					{
						content: [
							{
								text: 'A wide variety of ',
								type: 'text'
							},
							{
								marks: [
									{
										attrs: {
											class: null,
											href: '/docs/fieds',
											rel: 'noopener noreferrer nofollow',
											target: '_self'
										},
										type: 'link'
									}
								],
								text: 'fields',
								type: 'text'
							},
							{
								text: ', including blocks and nested arrays',
								type: 'text'
							}
						],
						type: 'paragraph'
					}
				],
				type: 'listItem'
			},
			{
				content: [
					{
						content: [
							{
								text: 'A flexible, intuitive rich-text editor',
								type: 'text'
							}
						],
						type: 'paragraph'
					}
				],
				type: 'listItem'
			},
			{
				content: [
					{
						content: [
							{
								text: 'Headless architecture, so you can build your front-end without limitations',
								type: 'text'
							}
						],
						type: 'paragraph'
					}
				],
				type: 'listItem'
			},
			{
				content: [
					{
						content: [
							{
								text: 'Automatic API endpoint generation',
								type: 'text'
							}
						],
						type: 'paragraph'
					}
				],
				type: 'listItem'
			},
			{
				content: [
					{
						content: [
							{
								text: 'Great types supports, from your database schema to your front-end',
								type: 'text'
							}
						],
						type: 'paragraph'
					}
				],
				type: 'listItem'
			},
			{
				content: [
					{
						content: [
							{
								text: 'Smooth, developer-friendly workflow',
								type: 'text'
							}
						],
						type: 'paragraph'
					}
				],
				type: 'listItem'
			}
		],
		type: 'bulletList'
	}
];

test('should handle simple bullet-list', async () => {
	const result = await markdownToJson(md);
	expect(JSON.stringify(result.content)).toBe(JSON.stringify(expected));
});

const md2 = `**Rime** is a headless CMS built on top of **SvelteKit**, designed with a focus on flexibility, ease of configuration, user-friendly administration, and performance. It’s made for developers who want to concentrate on creativity rather than fighting with the tools.

[resource:pages:introduction](/docs/01-introduction.md)

## Why another CMS ?

The main goal of **Rime** is to provide instant access to a flexible admin panel, with all the essential tools to build your project, including:

- Built-in [i18n](/docs/03-04-configuration__i18n.md) support
- Version system
- A wide variety of [fields](/docs/04-fieds.md), including blocks and nested arrays
- A flexible, intuitive rich-text editor
- Headless architecture, so you can build your front-end without limitations
- Automatic API endpoint generation
- Great types supports, from your database schema to your front-end
- Smooth, developer-friendly workflow

While some existing tools offer similar features — with varying levels of configuration complexity — none of them truly met my needs without compromise. **Rime** bridges that gap, combining the full power of **SvelteKit** and **Svelte**, while providing all the features a CMS needs.`;

const expected2 = [
	{
		content: [
			{
				marks: [
					{
						type: 'bold'
					}
				],
				text: 'Rime',
				type: 'text'
			},
			{
				text: ' is a headless CMS built on top of ',
				type: 'text'
			},
			{
				marks: [
					{
						type: 'bold'
					}
				],
				text: 'SvelteKit',
				type: 'text'
			},
			{
				text: ', designed with a focus on flexibility, ease of configuration, user-friendly administration, and performance. It’s made for developers who want to concentrate on creativity rather than fighting with the tools.',
				type: 'text'
			}
		],
		type: 'paragraph'
	},
	{
		attrs: {
			id: '3c8e9108-e830-4685-bb98-e011c1a748f0',
			_type: 'pages'
		},
		resource: {
			id: '3c8e9108-e830-4685-bb98-e011c1a748f0'
		},
		type: 'resource'
	},
	{
		attrs: {
			level: 2
		},
		content: [
			{
				text: 'Why another CMS ?',
				type: 'text'
			}
		],
		type: 'heading'
	},
	{
		content: [
			{
				text: 'The main goal of ',
				type: 'text'
			},
			{
				marks: [
					{
						type: 'bold'
					}
				],
				text: 'Rime',
				type: 'text'
			},
			{
				text: ' is to provide instant access to a flexible admin panel, with all the essential tools to build your project, including:',
				type: 'text'
			}
		],
		type: 'paragraph'
	},
	{
		content: [
			{
				content: [
					{
						content: [
							{
								text: 'Built-in ',
								type: 'text'
							},
							{
								marks: [
									{
										attrs: {
											class: null,
											href: '/docs/configuration/i18n',
											rel: 'noopener noreferrer nofollow',
											target: '_self'
										},
										type: 'link'
									}
								],
								text: 'i18n',
								type: 'text'
							},
							{
								text: ' support',
								type: 'text'
							}
						],
						type: 'paragraph'
					}
				],
				type: 'listItem'
			},
			{
				content: [
					{
						content: [
							{
								text: 'Version system',
								type: 'text'
							}
						],
						type: 'paragraph'
					}
				],
				type: 'listItem'
			},
			{
				content: [
					{
						content: [
							{
								text: 'A wide variety of ',
								type: 'text'
							},
							{
								marks: [
									{
										attrs: {
											class: null,
											href: '/docs/fieds',
											rel: 'noopener noreferrer nofollow',
											target: '_self'
										},
										type: 'link'
									}
								],
								text: 'fields',
								type: 'text'
							},
							{
								text: ', including blocks and nested arrays',
								type: 'text'
							}
						],
						type: 'paragraph'
					}
				],
				type: 'listItem'
			},
			{
				content: [
					{
						content: [
							{
								text: 'A flexible, intuitive rich-text editor',
								type: 'text'
							}
						],
						type: 'paragraph'
					}
				],
				type: 'listItem'
			},
			{
				content: [
					{
						content: [
							{
								text: 'Headless architecture, so you can build your front-end without limitations',
								type: 'text'
							}
						],
						type: 'paragraph'
					}
				],
				type: 'listItem'
			},
			{
				content: [
					{
						content: [
							{
								text: 'Automatic API endpoint generation',
								type: 'text'
							}
						],
						type: 'paragraph'
					}
				],
				type: 'listItem'
			},
			{
				content: [
					{
						content: [
							{
								text: 'Great types supports, from your database schema to your front-end',
								type: 'text'
							}
						],
						type: 'paragraph'
					}
				],
				type: 'listItem'
			},
			{
				content: [
					{
						content: [
							{
								text: 'Smooth, developer-friendly workflow',
								type: 'text'
							}
						],
						type: 'paragraph'
					}
				],
				type: 'listItem'
			}
		],
		type: 'bulletList'
	},
	{
		content: [
			{
				text: 'While some existing tools offer similar features — with varying levels of configuration complexity — none of them truly met my needs without compromise. ',
				type: 'text'
			},
			{
				marks: [
					{
						type: 'bold'
					}
				],
				text: 'Rime',
				type: 'text'
			},
			{
				text: ' bridges that gap, combining the full power of ',
				type: 'text'
			},
			{
				marks: [
					{
						type: 'bold'
					}
				],
				text: 'SvelteKit',
				type: 'text'
			},
			{
				text: ' and ',
				type: 'text'
			},
			{
				marks: [
					{
						type: 'bold'
					}
				],
				text: 'Svelte',
				type: 'text'
			},
			{
				text: ', while providing all the features a CMS needs.',
				type: 'text'
			}
		],
		type: 'paragraph'
	}
];

test('should handle bullet-list with other stuff', async () => {
	const result = await markdownToJson(md2);
	expect(JSON.stringify(result.content)).toBe(JSON.stringify(expected2));
});
