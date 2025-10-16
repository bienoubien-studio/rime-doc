/**
 * CodeBlock node renderer - converts code block nodes to Markdown fenced code blocks
 */

export const codeBlock = (node, renderers) => {
	const language = node.attrs?.language || '';

	if (!node.content || !Array.isArray(node.content)) {
		return `\`\`\`${language}\n\n\`\`\``;
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

	return `\`\`\`${language}\n${content}\n\`\`\``;
};

/**
 * Parses markdown code block to JSON
 * @param {string[]} lines - Array of markdown lines
 * @param {number} startIndex - Starting line index
 * @returns {Object} - { node: codeBlock node, endIndex: ending line index }
 */
export const parseCodeBlock = (lines, startIndex) => {
	const line = lines[startIndex];
	const language = line.slice(3).trim();
	let i = startIndex + 1;
	const codeLines = [];

	while (i < lines.length && !lines[i].startsWith('```')) {
		codeLines.push(lines[i]);
		i++;
	}

	return {
		node: {
			type: 'codeBlock',
			attrs: { language },
			content: [{ type: 'text', text: codeLines.join('\n') }]
		},
		endIndex: i
	};
};

/**
 * Checks if a line matches this block type
 */
export const matchesCodeBlock = (line) => line.trim().startsWith('```');
