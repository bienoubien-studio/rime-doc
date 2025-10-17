/**
 * Tag-warn mark renderer - converts tag-warn marks to custom warning formatting
 * @param {string} text - The text content to wrap in warning tag formatting
 * @returns {string} The text wrapped in custom warning tag syntax
 */
export const tagWarn = (text) => `{{!${text}!}}`;

/**
 * Parses markdown tag-warn to JSON mark
 * @returns {{type: string}} The tag-warn mark object
 */
export const parseTagWarnMark = () => {
	return {
		type: 'tag-warn'
	};
};

/**
 * Checks if text contains tag-warn formatting
 * @param {string} text - The text to check
 * @returns {boolean} Whether the text contains tag-warn formatting
 */
export const matchesTagWarn = (text) => /\{\{!([^!]+)!\}\}/.test(text);

/**
 * Extracts tag-warn segments from text
 * @param {string} text - The text to parse
 * @returns {Array<{type: string, text: string, marks?: Array<{type: string}>}>} Array of text segments with marks
 */
export const parseTagWarnInText = (text) => {
	const parts = [];
	const warnMatches = text.match(/\{\{!([^!]+)!\}\}/g);

	if (!warnMatches) {
		return [{ type: 'text', text }];
	}

	let currentText = text;
	warnMatches.forEach((match) => {
		const beforeWarn = currentText.split(match)[0];
		if (beforeWarn) {
			parts.push({ type: 'text', text: beforeWarn });
		}
		parts.push({
			type: 'text',
			text: match.slice(3, -3),
			marks: [{ type: 'tag-warn' }]
		});
		currentText = currentText.split(match).slice(1).join(match);
	});

	if (currentText) {
		parts.push({ type: 'text', text: currentText });
	}

	return parts;
};
