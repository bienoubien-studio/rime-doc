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
 * @param {any} node - The JSON node to render
 * @param {Record<string, Function>} renderers - Custom renderers to override defaults
 * @returns {string} The rendered string
 */
function renderNode(node, renderers = {}) {
	if (!node || typeof node !== 'object') {
		console.warn('Invalid node:', node);
		return '';
	}

	const allRenderers = /** @type {any} */ ({ ...defaultMarkdownRenderers, ...renderers });
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
 * @returns {string} The converted Markdown string
 */
export function jsonToMarkdown(json) {
	return renderNode(json);
}

/**
 * Converts Markdown to ProseMirror JSON
 * @param {string} markdown - The Markdown string to convert
 * @returns {Promise<Object>} The converted ProseMirror JSON document
 */
export async function markdownToJson(markdown) {
	const lines = markdown.split('\n');
	const content = [];
	let i = 0;

	// Define parsing order (more specific parsers first)
	const parsers = [
		{
			matcher: matchesResource,
			parser: async (/** @type {string[]} */ lines, /** @type {number} */ i) => ({ node: await parseResource(lines[i]), endIndex: i })
		},
		{
			matcher: matchesHeading,
			parser: (/** @type {string[]} */ lines, /** @type {number} */ i) => ({ node: parseHeading(lines[i]), endIndex: i })
		},
		{ matcher: matchesCodeBlock, parser: parseCodeBlock },
		{ matcher: matchesInfoBlock, parser: parseInfoBlock },
		{ matcher: matchesWarnBlock, parser: parseWarnBlock },
		{ matcher: matchesTable, parser: parseTable },
		{ matcher: matchesBulletList, parser: parseBulletList },
		{ matcher: matchesOrderedList, parser: parseOrderedList },
		{
			matcher: matchesParagraph,
			parser: (/** @type {string[]} */ lines, /** @type {number} */ i) => ({ node: parseParagraph(lines[i]), endIndex: i })
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
				const result = await parser(lines, i);
				if (result && result.node) {
					content.push(result.node);
				}
				if (result && typeof result.endIndex === 'number') {
					i = result.endIndex + 1;
				} else {
					i++;
				}
				matched = true;
				break;
			}
		}

		// Fallback if no parser matches
		if (!matched) {
			i++;
		}
	}

	/**
	 * Recursively validates that all text nodes have string text values
	 * @param {any} obj - Object to validate
	 * @param {string} path - Current path for error reporting
	 */
	function validateTextNodes(obj, path = '') {
		if (Array.isArray(obj)) {
			obj.forEach((item, index) => {
				validateTextNodes(item, path ? `${path}.${index}` : `${index}`);
			});
		} else if (obj && typeof obj === 'object') {
			if (obj.type === 'text' && typeof obj.text !== 'string') {
				throw new Error(`Invalid text node at ${path}.text: expected string, got ${typeof obj.text} (${JSON.stringify(obj.text)})`);
			}

			Object.keys(obj).forEach(key => {
				validateTextNodes(obj[key], path ? `${path}.${key}` : key);
			});
		}
	}

	const filteredContent = content.filter(node => node !== null && node !== undefined);

	// Validate that all text nodes have string text values
	validateTextNodes(filteredContent);

	return {
		type: 'doc',
		content: filteredContent
	};
}

// Re-export renderers for customization
export { defaultMarkdownRenderers, renderNode };
