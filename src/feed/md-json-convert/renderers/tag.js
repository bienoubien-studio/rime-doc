/**
 * Tag mark renderer - converts tag marks to custom tag formatting
 */

export const tag = (text, mark) => {
	return `{{${text}}}`;
};

/**
 * Parses markdown tag to JSON mark
 * @param {string} text - The text content inside the tag
 * @returns {Object} - The tag mark
 */
export const parseTagMark = (text) => {
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
 * @returns {boolean} - Whether the text contains tag formatting
 */
export const matchesTag = (text) => /\{\{([^}!]+)\}\}/.test(text);

/**
 * Extracts tag segments from text
 * @param {string} text - The text to parse
 * @returns {Array} - Array of text segments with marks
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
