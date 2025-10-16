/**
 * Heading node renderer - converts heading nodes to Markdown headers
 */

export const heading = (node, renderers) => {
	const level = node.attrs?.level || 1;
	const hashes = '#'.repeat(level);

	if (!node.content || !Array.isArray(node.content)) {
		return `${hashes} `;
	}

	const content = node.content
		.map((child) => {
			const renderer = renderers[child.type];
			if (!renderer) {
				console.warn(`No renderer found for node type: ${child.type}`);
				return '';
			}
			return renderer(child, renderers);
		})
		.join('');

	return `${hashes} ${content}`;
};

/**
 * Parses markdown heading to JSON
 * @param {string} line - The markdown line to parse
 * @returns {Object|null} - The heading node or null if not a heading
 */
export const parseHeading = (line) => {
	if (!line.startsWith('#')) {
		return null;
	}

	const level = line.match(/^#+/)[0].length;
	const text = line.replace(/^#+\s*/, '');

	return {
		type: 'heading',
		attrs: { level },
		content: [{ type: 'text', text }]
	};
};

/**
 * Checks if a line matches this block type
 */
export const matchesHeading = (line) => line.trim().startsWith('#');
