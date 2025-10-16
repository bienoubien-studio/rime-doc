/**
 * Text node renderer - handles text content with marks
 */

export const text = (node, renderers) => {
	let text = node.text || '';

	// Apply marks to text
	if (node.marks) {
		node.marks.forEach((mark) => {
			const markRenderer = renderers[mark.type];
			if (markRenderer) {
				text = markRenderer(text, mark);
			}
		});
	}

	return text;
};

/**
 * Parses markdown text to JSON
 * @param {string} text - The text content
 * @param {Object[]} marks - Optional marks to apply
 * @returns {Object} - The text node
 */
export const parseText = (text, marks = []) => {
	return {
		type: 'text',
		text,
		...(marks.length > 0 && { marks })
	};
};

/**
 * Checks if this is text (always true for text content)
 */
export const matchesText = () => true;
