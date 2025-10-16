/**
 * Resource node renderer - converts resource nodes to Markdown links
 */

export const resource = (node) => {
	const type = node.attrs?._type || 'pages';
	const id = node.attrs?.id || 'unknown';
	return `[resource:${type}:${id}]`;
};

/**
 * Parses markdown resource link to JSON
 */
export const parseResource = (line) => {
	// Resource pattern: [resource:type:id]
	const resourceMatch = line.match(/^\[resource:([^:]+):([^\]]+)\]$/);

	if (!resourceMatch) {
		return null;
	}

	const [, type, id] = resourceMatch;

	return {
		type: 'resource',
		attrs: {
			id,
			_type: type
		},
		resource: {
			id
		}
	};
};

/**
 * Checks if a line matches this block type
 */
export const matchesResource = (line) => {
	return /^\[resource:[^:]+:[^\]]+\]$/.test(line.trim());
};
