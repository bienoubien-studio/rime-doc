/**
 * BulletList node renderer - converts bullet list nodes to Markdown unordered lists
 */

export const bulletList = (node, renderers) => {
	if (!node.content || !Array.isArray(node.content)) {
		return '';
	}

	return node.content
		.map((child) => {
			const renderer = renderers[child.type];
			if (!renderer) {
				console.warn(`No renderer found for node type: ${child.type}`);
				return '';
			}
			return renderer(child, renderers);
		})
		.join('\n');
};

/**
 * Parses markdown bullet list to JSON
 * @param {string[]} lines - Array of markdown lines
 * @param {number} startIndex - Starting line index
 * @returns {Object} - { node: bulletList node, endIndex: ending line index }
 */
export const parseBulletList = (lines, startIndex) => {
	const listItems = [];
	let i = startIndex;

	while (i < lines.length) {
		const currentLine = lines[i].trim();

		if (!currentLine) {
			i++;
			break;
		}

		if (currentLine.startsWith('- ')) {
			const text = currentLine.replace(/^-\s/, '');
			listItems.push({
				type: 'listItem',
				content: [{ type: 'paragraph', content: [{ type: 'text', text }] }]
			});
			i++;
		} else {
			break;
		}
	}

	return {
		node: {
			type: 'bulletList',
			content: listItems
		},
		endIndex: i - 1
	};
};

/**
 * Checks if a line matches this block type
 */
export const matchesBulletList = (line) => line.trim().startsWith('- ');
