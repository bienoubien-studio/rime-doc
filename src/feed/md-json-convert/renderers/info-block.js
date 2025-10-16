/**
 * InfoBlock node renderer - converts info block nodes to Markdown info blockquotes
 */

export const infoBlock = (node, renderers) => {
	const content = node.content
		.map((child) => {
			const renderer = renderers[child.type];
			if (!renderer) {
				console.warn(`No renderer found for node type: ${child.type}`);
				return '';
			}
			return renderer(child, renderers);
		})
		.join('\n');

	// Convert to blockquote format with info indicator
	const lines = content.split('\n');
	const blockquoteLines = lines.map((line) => `> ${line}`);

	return `> **ℹ️ Info**\n${blockquoteLines.join('\n')}`;
};

/**
 * Parses markdown info block to JSON
 * @param {string[]} lines - Array of markdown lines
 * @param {number} startIndex - Starting line index
 * @returns {Object} - { node: infoBlock node, endIndex: ending line index }
 */
export const parseInfoBlock = (lines, startIndex) => {
	const blockContent = [];
	let i = startIndex;

	// Skip the info header line
	if (lines[i].includes('**ℹ️ Info**')) {
		i++;
	}

	// Parse blockquote content
	while (i < lines.length) {
		const line = lines[i];

		if (!line.startsWith('> ')) {
			break;
		}

		const content = line.replace(/^> /, '');
		if (content.trim()) {
			blockContent.push(content);
		}
		i++;
	}

	// Join all blockquote content and parse inline formatting
	const fullContent = blockContent.join(' ');
	const parsedParagraph = parseInlineText(fullContent);

	return {
		node: {
			type: 'infoBlock',
			content: [parsedParagraph]
		},
		endIndex: i - 1
	};
};

/**
 * Parses text with inline formatting
 * @param {string} text - Text to parse
 * @returns {Object} - Paragraph node with formatted content
 */
function parseInlineText(text) {
	const textNodes = [];
	let remainingText = text;

	// Parse bold formatting
	const boldMatches = remainingText.match(/\*\*([^*]+)\*\*/g);
	if (boldMatches) {
		boldMatches.forEach((match) => {
			const parts = remainingText.split(match);
			const beforeBold = parts[0];

			if (beforeBold) {
				// Check for code within the before text
				const codeMatches = beforeBold.match(/`([^`]+)`/g);
				if (codeMatches) {
					parseCodeInParagraph(beforeBold, textNodes);
				} else {
					textNodes.push({ type: 'text', text: beforeBold });
				}
			}

			textNodes.push({
				type: 'text',
				text: match.slice(2, -2),
				marks: [{ type: 'bold' }]
			});

			remainingText = parts.slice(1).join(match);
		});
	}

	// Handle remaining text (may contain code)
	if (remainingText) {
		const codeMatches = remainingText.match(/`([^`]+)`/g);
		if (codeMatches) {
			parseCodeInParagraph(remainingText, textNodes);
		} else {
			textNodes.push({ type: 'text', text: remainingText });
		}
	}

	// If no formatting was found, just add the text
	if (textNodes.length === 0) {
		textNodes.push({ type: 'text', text });
	}

	return {
		type: 'paragraph',
		content: textNodes
	};
}

/**
 * Helper to parse code formatting within text
 * @param {string} text - Text to parse
 * @param {Array} textNodes - Array to add parsed nodes to
 */
function parseCodeInParagraph(text, textNodes) {
	const codeMatches = text.match(/`([^`]+)`/g);
	let currentText = text;

	codeMatches.forEach((match) => {
		const beforeCode = currentText.split(match)[0];
		if (beforeCode) {
			textNodes.push({ type: 'text', text: beforeCode });
		}
		textNodes.push({
			type: 'text',
			text: match.slice(1, -1),
			marks: [{ type: 'code' }]
		});
		currentText = currentText.split(match).slice(1).join(match);
	});

	if (currentText) {
		textNodes.push({ type: 'text', text: currentText });
	}
}

/**
 * Checks if a line matches this block type
 */
export const matchesInfoBlock = (line) => line.includes('**ℹ️ Info**');
