import { expect, test } from 'vitest';
import { markdownToJson } from '../index.js';

const md = `
If you’ve followed the [installation](/docs/02-installation.md) steps correctly, you should already have a \`pages\` collection and the \`$adapter\` property set up.

The configuration is the core of **Rime**, this is where you {{configure}} how your documents will be structured, localization, panel access, custom API routes and [more](#properties)… The configuration entry **must be located at **\`src/lib/+rime/rime.config.ts\`. Here is a basic configuration example :
`;

const expected = [
	{
		content: [
			{
				text: 'If you’ve followed the ',
				type: 'text'
			},
			{
				marks: [
					{
						attrs: {
							class: null,
							href: '/docs/installation',
							rel: 'noopener noreferrer nofollow',
							target: '_self'
						},
						type: 'link'
					}
				],
				text: 'installation',
				type: 'text'
			},
			{
				text: ' steps correctly, you should already have a ',
				type: 'text'
			},
			{
				marks: [
					{
						type: 'code'
					}
				],
				text: 'pages',
				type: 'text'
			},
			{
				text: ' collection and the ',
				type: 'text'
			},
			{
				marks: [
					{
						type: 'code'
					}
				],
				text: '$adapter',
				type: 'text'
			},
			{
				text: ' property set up.',
				type: 'text'
			}
		],
		type: 'paragraph'
	},
	{
		content: [
			{
				text: 'The configuration is the core of ',
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
				text: ', this is where you ',
				type: 'text'
			},
			{
				marks: [
					{
						type: 'tag'
					}
				],
				text: 'configure',
				type: 'text'
			},
			{
				text: ' how your documents will be structured, localization, panel access, custom API routes and ',
				type: 'text'
			},
			{
				marks: [
					{
						attrs: {
							class: null,
							href: '#properties',
							rel: 'noopener noreferrer nofollow',
							target: '_self'
						},
						type: 'link'
					}
				],
				text: 'more',
				type: 'text'
			},
			{
				text: '… The configuration entry ',
				type: 'text'
			},
			{
				marks: [
					{
						type: 'bold'
					}
				],
				text: 'must be located at ',
				type: 'text'
			},
			{
				marks: [
					{
						type: 'code'
					}
				],
				text: 'src/lib/+rime/rime.config.ts',
				type: 'text'
			},
			{
				text: '. Here is a basic configuration example :',
				type: 'text'
			}
		],
		type: 'paragraph'
	}
];

test('should extract 2 paragraph', async () => {
	const result = await markdownToJson(md);
	expect(JSON.stringify(result.content)).toBe(JSON.stringify(expected));
});
