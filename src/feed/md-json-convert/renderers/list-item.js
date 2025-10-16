/**
 * ListItem node renderer - converts list item nodes to Markdown list items
 */

export const listItem = (node, renderers) => {
	if (!node.content || !Array.isArray(node.content)) {
		return '- ';
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
		.join('\n');

	// Handle nested lists by indenting additional lines
	const lines = content.split('\n');
	const firstLine = `- ${lines[0]}`;
	const remainingLines = lines
		.slice(1)
		.map((line) => (line ? `  ${line}` : ''))
		.join('\n');

	return remainingLines ? `${firstLine}\n${remainingLines}` : firstLine;
};

/**
 * Parses markdown list item to JSON
 * @param {string} text - The list item text (without the marker)
 * @returns {Object} - The listItem node
 */
export const parseListItem = (text) => {
	return {
		type: 'listItem',
		content: [{ type: 'paragraph', content: [{ type: 'text', text }] }]
	};
};

/**
 * Checks if a line matches this block type
 */
export const matchesListItem = (line) =>
	line.trim().startsWith('- ') || line.trim().match(/^\d+\.\s/);
