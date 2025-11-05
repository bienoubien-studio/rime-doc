import { expect, test } from 'vitest';
import { markdownToJson } from '..';

const md = `> [!INFO] Note that **server-only properties** are declared with the \`$\` prefix. This is because the configuration will be split into a client and server versions, **generated in the **\`$lib/+rime.generated\`** folder (location may change, but this setup ensures relative imports remain intact).**`;

const expected = [
	{
		content: [
			{
				content: [
					{ text: 'Note that ', type: 'text' },
					{
						marks: [{ type: 'bold' }],
						text: 'server-only properties',
						type: 'text'
					},
					{ text: ' are declared with the ', type: 'text' },
					{ marks: [{ type: 'code' }], text: '$', type: 'text' },
					{
						text: ' prefix. This is because the configuration will be split into a client and server versions, ',
						type: 'text'
					},
					{
						marks: [{ type: 'bold' }],
						text: 'generated in the ',
						type: 'text'
					},
					{
						marks: [{ type: 'code' }],
						text: '$lib/+rime.generated',
						type: 'text'
					},
					{
						marks: [{ type: 'bold' }],
						text: ' folder (location may change, but this setup ensures relative imports remain intact).',
						type: 'text'
					}
				],
				type: 'paragraph'
			}
		],
		type: 'infoBlock'
	}
];

test('should parse info block', async () => {
	const result = await markdownToJson(md);
	expect(JSON.stringify(result.content)).toBe(JSON.stringify(expected));
});
