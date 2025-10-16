/**
 * Main entry point for the MD-JSON converter
 * Handles bidirectional conversion between ProseMirror JSON and Markdown
 */

import { matchesBulletList, parseBulletList } from './renderers/bullet-list.js';
import { matchesCodeBlock, parseCodeBlock } from './renderers/code-block.js';
import { matchesHeading, parseHeading } from './renderers/heading.js';
import { defaultMarkdownRenderers } from './renderers/index.js';
import { matchesInfoBlock, parseInfoBlock } from './renderers/info-block.js';
import { matchesOrderedList, parseOrderedList } from './renderers/ordered-list.js';
import { matchesParagraph, parseParagraph } from './renderers/paragraph.js';
import { matchesResource, parseResource } from './renderers/resource.js';
import { matchesTable, parseTable } from './renderers/table.js';
import { matchesWarnBlock, parseWarnBlock } from './renderers/warn-block.js';

/**
 * Renders a JSON node using the provided renderers
 */
function renderNode(node, renderers = {}) {
	if (!node || typeof node !== 'object') {
		console.warn('Invalid node:', node);
		return '';
	}

	const allRenderers = { ...defaultMarkdownRenderers, ...renderers };
	const renderer = allRenderers[node.type];

	if (!renderer) {
		console.warn(`No renderer found for node type: ${node.type}`);
		return '';
	}

	return renderer(node, allRenderers);
}

/**
 * Converts ProseMirror JSON to Markdown
 * @param {Object} json - The ProseMirror JSON document
 * @param {Object} customRenderers - Optional custom renderers to override defaults
 * @returns {string} The converted Markdown string
 */
export function jsonToMarkdown(json, customRenderers = {}) {
	return renderNode(json, customRenderers);
}

/**
 * Converts Markdown to ProseMirror JSON
 * @param {string} markdown - The Markdown string to convert
 * @returns {Object} The converted ProseMirror JSON document
 */
export function markdownToJson(markdown) {
	const lines = markdown.split('\n');
	const content = [];
	let i = 0;

	// Define parsing order (more specific parsers first)
	const parsers = [
		{
			matcher: matchesHeading,
			parser: (lines, i) => ({ node: parseHeading(lines[i]), endIndex: i })
		},
		{ matcher: matchesCodeBlock, parser: parseCodeBlock },
		{ matcher: matchesInfoBlock, parser: parseInfoBlock },
		{ matcher: matchesWarnBlock, parser: parseWarnBlock },
		{ matcher: matchesTable, parser: parseTable },
		{
			matcher: matchesResource,
			parser: (lines, i) => ({ node: parseResource(lines[i]), endIndex: i })
		},
		{ matcher: matchesBulletList, parser: parseBulletList },
		{ matcher: matchesOrderedList, parser: parseOrderedList },
		{
			matcher: matchesParagraph,
			parser: (lines, i) => ({ node: parseParagraph(lines[i]), endIndex: i })
		}
	];

	while (i < lines.length) {
		const line = lines[i].trim();

		// Skip empty lines
		if (!line) {
			i++;
			continue;
		}

		// Find matching parser
		let matched = false;
		for (const { matcher, parser } of parsers) {
			if (matcher(line)) {
				const result = parser(lines, i);
				content.push(result.node);
				i = result.endIndex + 1;
				matched = true;
				break;
			}
		}

		// Fallback if no parser matches
		if (!matched) {
			i++;
		}
	}

	return {
		type: 'doc',
		content
	};
}

// Re-export renderers for customization
export { defaultMarkdownRenderers, renderNode };
