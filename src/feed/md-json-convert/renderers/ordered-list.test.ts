import { expect, test } from 'vitest';
import { markdownToJson } from '..';

const md = `1. Create a SvelteKit project if not already done :

\`\`\`bash
npx sv create svelte my-app && cd my-app
\`\`\`

2. Install **rime** :

\`\`\`bash
npm install rimecms
\`\`\`

3. Run the init command :

\`\`\`bash
npx rime init
\`\`\`

4. Launch the project :

\`\`\`bash
npm run dev
\`\`\`

5. Create the first admin user :

\`\`\`bash
curl -v POST http://localhost:5173/api/init \\\r
  -H "Content-Type: application/json" \\\r
  -d '{"email": "you@website.com", "password": "super-Secret+2000", "name": "Admin"}'
\`\`\`

### Next step

You can now visit the \`/panel\`, in which there will be nothing more than the basic stuffs, so let’s start adding some content types.

[resource:pages:Configuration](/docs/03-00-configuration.md)`;

const expected = [
	{
		attrs: {
			start: 1,
			type: null
		},
		content: [
			{
				content: [
					{
						content: [
							{
								text: 'Create a SvelteKit project if not already done :',
								type: 'text'
							}
						],
						type: 'paragraph'
					}
				],
				type: 'listItem'
			}
		],
		type: 'orderedList'
	},
	{
		attrs: {
			language: 'bash'
		},
		content: [
			{
				text: 'npx sv create svelte my-app && cd my-app',
				type: 'text'
			}
		],
		type: 'codeBlock'
	},
	{
		attrs: {
			start: 2,
			type: null
		},
		content: [
			{
				content: [
					{
						content: [
							{
								text: 'Install ',
								type: 'text'
							},
							{
								marks: [
									{
										type: 'bold'
									}
								],
								text: 'rime',
								type: 'text'
							},
							{
								text: ' :',
								type: 'text'
							}
						],
						type: 'paragraph'
					}
				],
				type: 'listItem'
			}
		],
		type: 'orderedList'
	},
	{
		attrs: {
			language: 'bash'
		},
		content: [
			{
				text: 'npm install rimecms',
				type: 'text'
			}
		],
		type: 'codeBlock'
	},
	{
		attrs: {
			start: 3,
			type: null
		},
		content: [
			{
				content: [
					{
						content: [
							{
								text: 'Run the init command :',
								type: 'text'
							}
						],
						type: 'paragraph'
					}
				],
				type: 'listItem'
			}
		],
		type: 'orderedList'
	},
	{
		attrs: {
			language: 'bash'
		},
		content: [
			{
				text: 'npx rime init',
				type: 'text'
			}
		],
		type: 'codeBlock'
	},
	{
		attrs: {
			start: 4,
			type: null
		},
		content: [
			{
				content: [
					{
						content: [
							{
								text: 'Launch the project :',
								type: 'text'
							}
						],
						type: 'paragraph'
					}
				],
				type: 'listItem'
			}
		],
		type: 'orderedList'
	},
	{
		attrs: {
			language: 'bash'
		},
		content: [
			{
				text: 'npm run dev',
				type: 'text'
			}
		],
		type: 'codeBlock'
	},
	{
		attrs: {
			start: 5,
			type: null
		},
		content: [
			{
				content: [
					{
						content: [
							{
								text: 'Create the first admin user :',
								type: 'text'
							}
						],
						type: 'paragraph'
					}
				],
				type: 'listItem'
			}
		],
		type: 'orderedList'
	},
	{
		attrs: {
			language: 'bash'
		},
		content: [
			{
				text: 'curl -v POST http://localhost:5173/api/init \\\r\n  -H "Content-Type: application/json" \\\r\n  -d \'{"email": "you@website.com", "password": "super-Secret+2000", "name": "Admin"}\'',
				type: 'text'
			}
		],
		type: 'codeBlock'
	},
	{
		attrs: {
			level: 3
		},
		content: [
			{
				text: 'Next step',
				type: 'text'
			}
		],
		type: 'heading'
	},
	{
		content: [
			{
				text: 'You can now visit the ',
				type: 'text'
			},
			{
				marks: [
					{
						type: 'code'
					}
				],
				text: '/panel',
				type: 'text'
			},
			{
				text: ', in which there will be nothing more than the basic stuffs, so let’s start adding some content types.',
				type: 'text'
			}
		],
		type: 'paragraph'
	},
	{
		attrs: {
			id: '8d492a76-9149-4c47-b203-ec4a644e1c21',
			_type: 'pages'
		},
		resource: {
			id: '8d492a76-9149-4c47-b203-ec4a644e1c21'
		},
		type: 'resource'
	}
];

test('should parse ordered list', async () => {
	const result = await markdownToJson(md);
	expect(JSON.stringify(result.content)).toBe(JSON.stringify(expected));
});
