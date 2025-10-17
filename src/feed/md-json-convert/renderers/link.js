import { convertPathToUri } from "../../index.js";

/**
 * Link mark renderer - converts link marks to Markdown link formatting
 * @param {string} text - The text content to display for the link
 * @param {{attrs?: {href?: string}}} mark - The link mark containing href attribute
 * @returns {string} The rendered markdown link
 */
export const link = (text, mark) => {
	const href = mark.attrs?.href || '#';
	return `[${text}](${href})`;
};

/**
 * Parses markdown link to JSON mark
 * @param {string} text - The text content inside the link
 * @param {string} href - The link URL
 * @returns {{type: string, attrs: {href: string, class: null, rel: string, target: string}}} The link mark object
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
 * @returns {boolean} Whether the text contains links
 */
export const matchesLink = (text) => /\[([^\]]+)\]\(([^)]+)\)/.test(text);

/**
 * Extracts link segments from text
 * @param {string} text - The text to parse
 * @returns {Array<{type: string, text: string, marks?: Array<{type: string, attrs: {href: string, class: null, rel: string, target: string}}>}>} Array of text segments with marks
 */
export const parseLinkInText = (text) => {
	const parts = [];
	const linkMatches = text.match(/\[([^\]]+)\]\(([^)]+)\)/g);

	if (!linkMatches) {
		return [{ type: 'text', text }];
	}

	let currentText = text;
	linkMatches.forEach((match) => {
		const linkMatch = match.match(/\[([^\]]+)\]\(([^)]+)\)/) || ['null','null','null'];
		const [fullMatch, linkText, value] = linkMatch;
		const href = '/docs/' + convertPathToUri(value.replace('/docs/', ''))
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
