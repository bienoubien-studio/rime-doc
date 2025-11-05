import { convertPathToUri } from '../../index.js';
import type { ParseResult } from '../index.js';

/**
 * Resource node renderer - handles resource blocks with fetch logic
 * Self-responsible renderer that parses resource syntax and creates resource nodes
 */

export const resourceRenderer = {
	type: 'node',
	matcher: /^\[resource:([^:]+):([^\]]+)\]\(([^)]+)\)(?:\n|$)/,

	/**
	 * Checks if markdown line is a resource
	 */
	match(input: string) {
		const result = input.match(this.matcher);

		return result;
	},

	/**
	 * Parses markdown resource to JSON with fetch logic
	 */
	async renderJSON(input: string): Promise<ParseResult | null> {
		// Resource pattern: [resource:type:label](path)
		const group = input.match(this.matcher);
		if (!group) return null;

		const [, type, , path] = group;

		const uri = convertPathToUri(path.replace('/docs/', ''));
		const url = `${process.env.PUBLIC_RIME_URL}/docs/${uri}`;
		const fetchUrl = `${process.env.PUBLIC_RIME_URL}/api/pages?where[url][equals]=${encodeURIComponent(url)}`;

		try {
			const response = await fetch(fetchUrl, {
				method: 'GET'
			});

			if (response.status !== 200 || !response.ok) {
				console.error(response);
				return null;
			}

			const { docs } = await response.json();

			if (!docs.length) return null;

			return {
				node: {
					attrs: {
						id: docs[0].id,
						_type: type
					},
					resource: {
						id: docs[0].id
					},
					type: 'resource'
				},
				consumed: group[0].length
			};
		} catch (error) {
			console.error('Error fetching resource:', error);
			return null;
		}
	}
};
