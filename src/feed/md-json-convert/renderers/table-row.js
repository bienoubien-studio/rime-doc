/**
 * TableRow node renderer - converts table row nodes to Markdown table rows
 * @param {{type: string, content: any[]}} node - The table row node
 * @param {Record<string, (node: any, renderers: any) => any>} renderers - Renderer function map
 * @returns {string} The rendered markdown table row
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
 * @returns {{type: string, content: Array<{type: string, attrs: {colspan: number, colwidth: null, rowspan: number}, content: Array<{type: string, content: Array<{type: string, text: string}>}>}>}} The tableRow node
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
			content: [{ type: 'paragraph', content: [{ type: 'text', text: String(cellText || '') }] }]
		}))
	};
};

/**
 * Checks if a line matches this block type
 * @param {string} line - The line to check
 * @returns {boolean} Whether the line matches table row format
 */
export const matchesTableRow = (line) => line.trim().startsWith('|');
