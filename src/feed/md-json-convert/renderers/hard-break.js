/**
 * HardBreak node renderer - converts hard break nodes to Markdown line breaks
 */

export const hardBreak = () => '  \n';

/**
 * Parses markdown hard break to JSON
 * @param {string} line - The markdown line to parse
 * @returns {Object} - The hardBreak node
 */
export const parseHardBreak = (line) => {
	return {
		type: 'hardBreak'
	};
};

/**
 * Checks if a line matches this block type
 */
export const matchesHardBreak = (line) => line.endsWith('  ');
