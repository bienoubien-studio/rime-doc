/**
 * Table node renderer - converts table nodes to Markdown tables
 * @param {{type: string, content?: any[]}} node - The table node
 * @param {Record<string, (node: any, renderers: any) => any>} renderers - Renderer function map
 * @returns {string} The rendered markdown table
 */

export const table = (node, renderers) => {
	if (!node.content || !Array.isArray(node.content)) {
		return '';
	}

	const rows = node.content.map((child) => {
		const renderer = renderers[child.type];
		if (!renderer) {
			console.warn(`No renderer found for node type: ${child.type}`);
			return '';
		}
		return renderer(child, renderers);
	});

	// Add header separator after first row if it contains tableHeader
	if (rows.length > 0) {
		const firstRow = node.content[0];
		const hasHeaders = firstRow.content?.some(/** @param {{type: string}} cell */ (cell) => cell.type === 'tableHeader');

		if (hasHeaders) {
			const headerCount = firstRow.content.length;
			const separator = '|' + ' --- |'.repeat(headerCount);
			rows.splice(1, 0, separator);
		}
	}

	return rows.join('\n');
};

/**
 * Parses markdown table to JSON
 * @param {string[]} lines - Array of markdown lines
 * @param {number} startIndex - Starting line index
 * @returns {{node: {type: string, content: Array<{type: string, content: Array<any>}>}, endIndex: number}} Object with table node and ending line index
 */
export const parseTable = (lines, startIndex) => {
	const tableRows = [];
	let isFirstRow = true;
	let i = startIndex;

	while (i < lines.length) {
		const currentLine = lines[i].trim();

		// Break if not a table line
		if (!currentLine.startsWith('|') && !currentLine.match(/^\|.*\|$/)) {
			break;
		}

		// Skip separator row
		if (currentLine.match(/^\|[\s\-|]+\|$/)) {
			i++;
			continue;
		}

		// Check if this is a valid table row (has proper | structure)
		const cells = currentLine.split('|');

		// Skip malformed table rows (incomplete | structure)
		if (cells.length < 3 || !currentLine.endsWith('|')) {
			// This might be a continuation of previous cell content
			// For now, skip it as it's likely malformed
			i++;
			continue;
		}

		const cleanCells = cells.slice(1, -1).map((cell) => cell.trim());
		const cellType = isFirstRow ? 'tableHeader' : 'tableCell';

		// Parse cell content for inline formatting
		const parsedCells = cleanCells.map((cellText) => {
			const parsedContent = parseTableCellContent(cellText);
			return {
				type: cellType,
				attrs: { colspan: 1, colwidth: null, rowspan: 1 },
				content: [{ type: 'paragraph', content: parsedContent }]
			};
		});

		tableRows.push({
			type: 'tableRow',
			content: parsedCells
		});

		isFirstRow = false;
		i++;
	}

	return {
		node: {
			type: 'table',
			content: tableRows
		},
		endIndex: i - 1
	};
};

/**
 * Parse table cell content for inline formatting
 * @param {string} cellText - The cell text to parse
 * @returns {Array<{type: string, text: string, marks?: Array<{type: string, attrs?: any}>}>} Array of text nodes with formatting
 */
function parseTableCellContent(cellText) {
	const textNodes = [];

	// Check for tag-warn formatting first
	const tagWarnMatches = cellText.match(/\{\{!([^!]+)!\}\}/g);
	if (tagWarnMatches) {
		let remainingText = cellText;

		tagWarnMatches.forEach((match) => {
			const parts = remainingText.split(match);
			const beforeMatch = parts[0];

			if (beforeMatch) {
				textNodes.push({ type: 'text', text: beforeMatch });
			}

			textNodes.push({
				type: 'text',
				text: match.slice(3, -3),
				marks: [{ type: 'tag-warn' }]
			});

			remainingText = parts.slice(1).join(match);
		});

		if (remainingText) {
			textNodes.push({ type: 'text', text: remainingText });
		}

		return textNodes;
	}

	// Check for links
	const linkMatches = cellText.match(/\[([^\]]+)\]\(([^)]+)\)/g);
	if (linkMatches) {
		let remainingText = cellText;

		linkMatches.forEach((match) => {
			const linkMatch = match.match(/\[([^\]]+)\]\(([^)]+)\)/) || ['null', 'null', 'null'];
			const [fullMatch, linkText, href] = linkMatch;
			const parts = remainingText.split(fullMatch);
			const beforeMatch = parts[0];

			if (beforeMatch) {
				textNodes.push({ type: 'text', text: beforeMatch });
			}

			textNodes.push({
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
			});

			remainingText = parts.slice(1).join(fullMatch);
		});

		if (remainingText) {
			textNodes.push({ type: 'text', text: remainingText });
		}

		return textNodes;
	}

	// No special formatting, return plain text
	return [{ type: 'text', text: cellText }];
}

/**
 * Checks if a line matches this block type
 * @param {string} line - The line to check
 * @returns {boolean} Whether the line matches table format
 */
export const matchesTable = (line) => line.trim().startsWith('|');
