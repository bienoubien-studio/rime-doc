/**
 * OrderedList node renderer - converts ordered list nodes to Markdown numbered lists
 */

export const orderedList = (node, renderers) => {
	const start = node.attrs?.start || 1;

	if (!node.content || !Array.isArray(node.content)) {
		return '';
	}

	return node.content
		.map((child, index) => {
			const renderer = renderers[child.type];
			if (!renderer) {
				console.warn(`No renderer found for node type: ${child.type}`);
				return '';
			}

			const itemNumber = start + index;
			const renderedChild = renderer(child, renderers);
			// Replace the default list marker with numbered marker
			return renderedChild.replace(/^- /, `${itemNumber}. `);
		})
		.join('\n');
};

/**
 * Parses markdown ordered list to JSON
 * @param {string[]} lines - Array of markdown lines
 * @param {number} startIndex - Starting line index
 * @returns {Object} - { node: orderedList node, endIndex: ending line index }
 */
export const parseOrderedList = (lines, startIndex) => {
	const listItems = [];
	let i = startIndex;

	while (i < lines.length) {
		const currentLine = lines[i].trim();

		if (!currentLine) {
			i++;
			break;
		}

		if (currentLine.match(/^\d+\.\s/)) {
			const text = currentLine.replace(/^\d+\.\s/, '');
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
			type: 'orderedList',
			attrs: { start: 1, type: null },
			content: listItems
		},
		endIndex: i - 1
	};
};

/**
 * Checks if a line matches this block type
 */
export const matchesOrderedList = (line) => line.trim().match(/^\d+\.\s/);
