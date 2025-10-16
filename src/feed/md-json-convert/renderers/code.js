/**
 * Code mark renderer - converts code marks to inline code formatting
 */

export const code = (text) => `\`${text}\``;

/**
 * Parses markdown inline code to JSON mark
 * @param {string} text - The text content inside the code marks
 * @returns {Object} - The code mark
 */
export const parseCodeMark = (text) => {
	return {
		type: 'code'
	};
};

/**
 * Checks if text contains inline code
 * @param {string} text - The text to check
 * @returns {boolean} - Whether the text contains inline code
 */
export const matchesCode = (text) => /`([^`]+)`/.test(text);

/**
 * Extracts code segments from text
 * @param {string} text - The text to parse
 * @returns {Array} - Array of text segments with marks
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
