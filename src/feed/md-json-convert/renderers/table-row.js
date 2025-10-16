/**
 * TableRow node renderer - converts table row nodes to Markdown table rows
 */

export const tableRow = (node, renderers) => {
	const cells = node.content.map((child) => {
		const renderer = renderers[child.type];
		if (!renderer) {
			console.warn(`No renderer found for node type: ${child.type}`);
			return '';
		}
		return renderer(child, renderers);
	});

	return `| ${cells.join(' | ')} |`;
};

/**
 * Parses markdown table row to JSON
 * @param {string} line - The markdown table row line
 * @param {boolean} isHeader - Whether this is a header row
 * @returns {Object} - The tableRow node
 */
export const parseTableRow = (line, isHeader = false) => {
	const cells = line
		.split('|')
		.slice(1, -1)
		.map((cell) => cell.trim());
	const cellType = isHeader ? 'tableHeader' : 'tableCell';

	return {
		type: 'tableRow',
		content: cells.map((cellText) => ({
			type: cellType,
			attrs: { colspan: 1, colwidth: null, rowspan: 1 },
			content: [{ type: 'paragraph', content: [{ type: 'text', text: cellText }] }]
		}))
	};
};

/**
 * Checks if a line matches this block type
 */
export const matchesTableRow = (line) => line.trim().startsWith('|');
