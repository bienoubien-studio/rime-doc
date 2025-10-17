/**
 * Code mark renderer - converts code marks to inline code formatting
 * @param {string} text - The text content to wrap in inline code formatting
 * @returns {string} The text wrapped in markdown inline code syntax
 */
export const code = (text) => `\`${text}\``;

/**
 * Parses markdown inline code to JSON mark
 * @returns {{type: string}} The code mark object
 */
export const parseCodeMark = () => {
	return {
		type: 'code'
	};
};

/**
 * Checks if text contains inline code
 * @param {string} text - The text to check
 * @returns {boolean} Whether the text contains inline code
 */
export const matchesCode = (text) => /`([^`]+)`/.test(text);

/**
 * Extracts code segments from text
 * @param {string} text - The text to parse
 * @returns {Array<{type: string, text: string, marks?: Array<{type: string}>}>} Array of text segments with marks
 */
export const parseCodeInText = (text) => {
	const parts = [];
	const codeMatches = text.match(/`([^`]+)`/g);

	if (!codeMatches) {
		return [{ type: 'text', text }];
	}

	let currentText = text;
	codeMatches.forEach((match) => {
		const beforeCode = currentText.split(match)[0];
		if (beforeCode) {
			parts.push({ type: 'text', text: beforeCode });
		}
		parts.push({
			type: 'text',
			text: match.slice(1, -1),
			marks: [{ type: 'code' }]
		});
		currentText = currentText.split(match).slice(1).join(match);
	});

	if (currentText) {
		parts.push({ type: 'text', text: currentText });
	}

	return parts;
};
