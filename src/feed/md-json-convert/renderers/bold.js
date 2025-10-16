/**
 * Bold mark renderer - converts bold marks to Markdown bold formatting
 */

export const bold = (text) => `**${text}**`;

/**
 * Parses markdown bold text to JSON mark
 * @param {string} text - The text content inside the bold marks
 * @returns {Object} - The bold mark
 */
export const parseBoldMark = (text) => {
	return {
		type: 'bold'
	};
};

/**
 * Checks if text contains bold formatting
 * @param {string} text - The text to check
 * @returns {boolean} - Whether the text contains bold formatting
 */
export const matchesBold = (text) => /\*\*([^*]+)\*\*/.test(text);

/**
 * Extracts bold segments from text
 * @param {string} text - The text to parse
 * @returns {Array} - Array of text segments with marks
 */
export const parseBoldInText = (text) => {
	const parts = [];
	const boldMatches = text.match(/\*\*([^*]+)\*\*/g);

	if (!boldMatches) {
		return [{ type: 'text', text }];
	}

	let currentText = text;
	boldMatches.forEach((match) => {
		const beforeBold = currentText.split(match)[0];
		if (beforeBold) {
			parts.push({ type: 'text', text: beforeBold });
		}
		parts.push({
			type: 'text',
			text: match.slice(2, -2),
			marks: [{ type: 'bold' }]
		});
		currentText = currentText.split(match).slice(1).join(match);
	});

	if (currentText) {
		parts.push({ type: 'text', text: currentText });
	}

	return parts;
};
