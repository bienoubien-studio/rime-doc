/**
 * Resource node renderer - converts resource nodes to Markdown links
 * @param {{type: string, attrs?: {_type?: string, id?: string}}} node - The resource node
 * @returns {string} The rendered resource link
 */

import { convertPathToUri } from "../../index.js";

export const resource = (/** @type {any} */ node) => {
	const type = node.attrs?._type || 'pages';
	const label = node.attrs?.label || 'unknown';
	const path = node.attrs?.path || '#';
	return `[resource:${type}:${label}](${path})`;
};

/**
 * Parses markdown resource link to JSON
 * @param {string} line - The markdown line to parse
 * @returns {Promise<{type: string, attrs: {id: string, _type: string, path: string}, resource: {id: string}}|null>} The resource node or null if not a resource
 */
export const parseResource = async (line) => {
	// Resource pattern: [resource:type:label](path)
	const resourceMatch = line.match(/^\[resource:([^:]+):([^\]]+)\]\(([^)]+)\)$/);

	if (!resourceMatch) {
		return null;
	}

	const [, type, , path] = resourceMatch;

	const uri = convertPathToUri(path.replace('/docs/', ''))
	const url = `${process.env.PUBLIC_RIME_URL}/docs/${uri}`
	const fetchUrl = `${process.env.PUBLIC_RIME_URL}/api/pages?where[url][equals]=${encodeURIComponent(url)}`
	const response = await fetch(fetchUrl, {
    method: 'GET',
	})
	if(response.status !== 200 || !response.ok){
	  console.error(response)
	  return null
	}
	const { docs } = await response.json()
	if(!docs.length) return null

	return {
		type: 'resource',
		attrs: {
			id: docs[0].id,
			_type: type,
			path: path
		},
		resource: {
		  id: docs[0].id,
		}
	};
};

/**
 * Checks if a line matches this block type
 * @param {string} line - The line to check
 * @returns {boolean} Whether the line matches resource format
 */
export const matchesResource = (line) => {
	const result = /^\[resource:([^:]+):([^\]]+)\]\(([^)]+)\)$/.test(line.trim());
	return result;
};
