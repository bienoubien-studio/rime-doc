/**
 * Bold mark renderer - converts bold marks to Markdown bold formatting
 * @param {string} text - The text content to wrap in bold formatting
 * @returns {string} - The text wrapped in markdown bold syntax
 */
export const bold = (text) => `**${text}**`;

/**
 * Parses markdown bold text to JSON mark
 * @returns {{type: string}} - The bold mark object
 */
export const parseBoldMark = () => {
	return {
		type: 'bold'
	};
};

/**
 * Checks if text contains bold formatting
 * @param {string} text - The text to check
 * @returns {boolean} Whether the text contains bold formatting
 */
export const matchesBold = (text) => /\*\*([^*]+)\*\*/.test(text);

/**
 * Extracts bold segments from text
 * @param {string} text - The text to parse
 * @returns {Array<{type: string, text: string, marks?: Array<{type: string}>}>} Array of text segments with marks
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
