/**
 * Paragraph node renderer - handles paragraph content
 */

export const paragraph = (node, renderers) => {
	if (!node.content || !Array.isArray(node.content)) {
		return '';
	}

	return node.content
		.map((child) => {
			const renderer = renderers[child.type];
			if (!renderer) {
				console.warn(`No renderer found for node type: ${child.type}`);
				return '';
			}
			return renderer(child, renderers);
		})
		.join('');
};

/**
 * Parses markdown paragraph to JSON (with inline formatting)
 * @param {string} line - The markdown line to parse
 * @returns {Object} - The paragraph node
 */
export const parseParagraph = (line) => {
	// Handle inline formatting (code, bold, links)
	let processedText = line;
	const textNodes = [];

	// Check for various inline formatting patterns
	const hasCode = /`([^`]+)`/.test(processedText);
	const hasBold = /\*\*([^*]+)\*\*/.test(processedText);
	const hasLink = /\[([^\]]+)\]\(([^)]+)\)/.test(processedText);
	const hasTagWarn = /\{\{!([^!]+)!\}\}/.test(processedText);
	const hasTag = /\{\{([^}!]+)\}\}/.test(processedText);

	if (hasCode || hasBold || hasLink || hasTagWarn || hasTag) {
		// Parse inline formatting in order of precedence
		let parts = [{ type: 'text', text: processedText }];

		// Parse code first
		if (hasCode) {
			parts = parseInlineFormatting(parts, /`([^`]+)`/g, (match) => ({
				type: 'text',
				text: match.slice(1, -1),
				marks: [{ type: 'code' }]
			}));
		}

		// Parse bold
		if (hasBold) {
			parts = parseInlineFormatting(parts, /\*\*([^*]+)\*\*/g, (match) => ({
				type: 'text',
				text: match.slice(2, -2),
				marks: [{ type: 'bold' }]
			}));
		}

		// Parse links
		if (hasLink) {
			parts = parseInlineFormatting(parts, /\[([^\]]+)\]\(([^)]+)\)/g, (match) => {
				const linkMatch = match.match(/\[([^\]]+)\]\(([^)]+)\)/);
				const [, linkText, href] = linkMatch;
				return {
					type: 'text',
					text: linkText,
					marks: [
						{
							type: 'link',
							attrs: {
								href,
								class: null,
								rel: 'noopener noreferrer nofollow',
								target: '_self'
							}
						}
					]
				};
			});
		}

		// Parse tag-warn
		if (hasTagWarn) {
			parts = parseInlineFormatting(parts, /\{\{!([^!]+)!\}\}/g, (match) => ({
				type: 'text',
				text: match.slice(3, -3),
				marks: [{ type: 'tag-warn' }]
			}));
		}

		// Parse tag
		if (hasTag) {
			parts = parseInlineFormatting(parts, /\{\{([^}!]+)\}\}/g, (match) => ({
				type: 'text',
				text: match.slice(2, -2),
				marks: [{ type: 'tag', attrs: { type: 'info' } }]
			}));
		}

		textNodes.push(...parts);
	} else {
		textNodes.push({ type: 'text', text: processedText });
	}

	return {
		type: 'paragraph',
		content: textNodes
	};
};

/**
 * Helper function to parse inline formatting
 * @param {Array} parts - Current text parts
 * @param {RegExp} regex - Pattern to match
 * @param {Function} createNode - Function to create formatted node
 * @returns {Array} - Updated parts array
 */
function parseInlineFormatting(parts, regex, createNode) {
	const newParts = [];

	parts.forEach((part) => {
		if (part.marks || !regex.test(part.text)) {
			// Skip already formatted text or text without matches
			newParts.push(part);
			return;
		}

		const matches = part.text.match(regex);
		if (!matches) {
			newParts.push(part);
			return;
		}

		let currentText = part.text;
		matches.forEach((match) => {
			const beforeMatch = currentText.split(match)[0];
			if (beforeMatch) {
				newParts.push({ type: 'text', text: beforeMatch });
			}
			newParts.push(createNode(match));
			currentText = currentText.split(match).slice(1).join(match);
		});

		if (currentText) {
			newParts.push({ type: 'text', text: currentText });
		}
	});

	return newParts;
}

/**
 * Checks if a line matches this block type (fallback for regular text)
 */
export const matchesParagraph = (line) => line.trim().length > 0;
