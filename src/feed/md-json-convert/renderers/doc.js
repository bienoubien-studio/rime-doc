/**
 * Doc node renderer - handles the root document node
 * @param {{type: string, content?: any[]}} node - The document node
 * @param {Record<string, (node: any, renderers: any) => any>} renderers - Renderer function map
 * @returns {string} The rendered markdown document
 */

export const doc = (node, renderers) => {
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
		.join('\n\n');
};

/**
 * Parses markdown document to JSON (root level)
 * @param {Object[]} content - Array of parsed content nodes
 * @returns {{type: string, content: Object[]}} The doc node
 */
export const parseDoc = (content) => {
	return {
		type: 'doc',
		content
	};
};

/**
 * Checks if this is a document (always true for root)
 * @returns {boolean} Always returns true for document root
 */
export const matchesDoc = () => true;
