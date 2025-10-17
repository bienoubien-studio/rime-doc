/**
 * HardBreak node renderer - converts hard break nodes to Markdown line breaks
 * @returns {string} The markdown line break syntax
 */
export const hardBreak = () => '  \n';

/**
 * Parses markdown hard break to JSON
 * @returns {{type: string}} The hardBreak node object
 */
export const parseHardBreak = () => {
	return {
		type: 'hardBreak'
	};
};

/**
 * Checks if a line matches this block type
 * @param {string} line - The line to check
 * @returns {boolean} Whether the line ends with two spaces (hard break)
 */
export const matchesHardBreak = (line) => line.endsWith('  ');
