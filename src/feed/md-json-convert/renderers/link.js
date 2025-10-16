/**
 * Link mark renderer - converts link marks to Markdown link formatting
 */

export const link = (text, mark) => {
	const href = mark.attrs?.href || '#';
	return `[${text}](${href})`;
};

/**
 * Parses markdown link to JSON mark
 * @param {string} text - The text content inside the link
 * @param {string} href - The link URL
 * @returns {Object} - The link mark
 */
export const parseLinkMark = (text, href) => {
	return {
		type: 'link',
		attrs: {
			href,
			class: null,
			rel: 'noopener noreferrer nofollow',
			target: '_self'
		}
	};
};

/**
 * Checks if text contains link formatting
 * @param {string} text - The text to check
 * @returns {boolean} - Whether the text contains links
 */
export const matchesLink = (text) => /\[([^\]]+)\]\(([^)]+)\)/.test(text);

/**
 * Extracts link segments from text
 * @param {string} text - The text to parse
 * @returns {Array} - Array of text segments with marks
 */
export const parseLinkInText = (text) => {
	const parts = [];
	const linkMatches = text.match(/\[([^\]]+)\]\(([^)]+)\)/g);

	if (!linkMatches) {
		return [{ type: 'text', text }];
	}

	let currentText = text;
	linkMatches.forEach((match) => {
		const linkMatch = match.match(/\[([^\]]+)\]\(([^)]+)\)/);
		const [fullMatch, linkText, href] = linkMatch;

		const beforeLink = currentText.split(fullMatch)[0];
		if (beforeLink) {
			parts.push({ type: 'text', text: beforeLink });
		}
		parts.push({
			type: 'text',
			text: linkText,
			marks: [parseLinkMark(linkText, href)]
		});
		currentText = currentText.split(fullMatch).slice(1).join(fullMatch);
	});

	if (currentText) {
		parts.push({ type: 'text', text: currentText });
	}

	return parts;
};
