/**
 * TableCell node renderer - converts table cell nodes to Markdown table cell content
 * @param {{type: string, content?: any[]}} node - The table cell node
 * @param {Record<string, (node: any, renderers: any) => any>} renderers - Renderer function map
 * @returns {string} The rendered table cell content
 */

export const tableCell = (node, renderers) => {
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
		.join(' ') // Use space instead of empty string to avoid line breaks
		.replace(/\n/g, ' ') // Replace any newlines with spaces
		.replace(/\s+/g, ' ') // Collapse multiple spaces into single space
		.trim();
};

/**
 * Parses markdown table cell to JSON
 * @param {string} cellText - The cell text content
 * @returns {{type: string, attrs: {colspan: number, colwidth: null, rowspan: number}, content: Array<{type: string, content: Array<{type: string, text: string}>}>}} The tableCell node
 */
export const parseTableCell = (cellText) => {
	return {
		type: 'tableCell',
		attrs: { colspan: 1, colwidth: null, rowspan: 1 },
		content: [{ type: 'paragraph', content: [{ type: 'text', text: String(cellText || '').trim() }] }]
	};
};

/**
 * Checks if this is a table cell (used internally by table parser)
 * @returns {boolean} Always returns false (only used internally)
 */
export const matchesTableCell = () => false; // Only used internally
