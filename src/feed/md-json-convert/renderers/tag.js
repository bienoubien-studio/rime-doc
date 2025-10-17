/**
 * Tag mark renderer - converts tag marks to custom tag formatting
 * @param {string} text - The text content to wrap in tag formatting
 * @returns {string} The text wrapped in custom tag syntax
 */
export const tag = (text) => {
	return `{{${text}}}`;
};

/**
 * Parses markdown tag to JSON mark
 * @returns {{type: string, attrs: {type: string}}} The tag mark object
 */
export const parseTagMark = () => {
	return {
		type: 'tag',
		attrs: {
			type: 'info'
		}
	};
};

/**
 * Checks if text contains tag formatting
 * @param {string} text - The text to check
 * @returns {boolean} Whether the text contains tag formatting
 */
export const matchesTag = (text) => /\{\{([^}!]+)\}\}/.test(text);

/**
 * Extracts tag segments from text
 * @param {string} text - The text to parse
 * @returns {Array<{type: string, text: string, marks?: Array<{type: string, attrs: {type: string}}>}>} Array of text segments with marks
 */
export const parseTagInText = (text) => {
	const parts = [];
	const tagMatches = text.match(/\{\{([^}!]+)\}\}/g);

	if (!tagMatches) {
		return [{ type: 'text', text }];
	}

	let currentText = text;
	tagMatches.forEach((match) => {
		const beforeTag = currentText.split(match)[0];
		if (beforeTag) {
			parts.push({ type: 'text', text: beforeTag });
		}
		parts.push({
			type: 'text',
			text: match.slice(2, -2),
			marks: [{ type: 'tag', attrs: { type: 'info' } }]
		});
		currentText = currentText.split(match).slice(1).join(match);
	});

	if (currentText) {
		parts.push({ type: 'text', text: currentText });
	}

	return parts;
};
