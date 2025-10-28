/**
 * Tag mark renderer - handles {{text}} formatting
 */

export const tagRenderer = {
	type: 'mark',
	inline: true,
	matcher: /\{\{([^}!]+)\}\}/,

	/**
	 * Checks if markdown text contains tag formatting
	 */
	match(input: string) {
		return input.match(this.matcher);
	},

	/**
	 * Converts tag match to JSON mark
	 */
	renderJSON(input: string) {
		const group = input.match(this.matcher);

		if (!group) return null;

		return {
			node: {
				marks: [{ type: 'tag' }],
				text: group[1],
				type: 'text'
			},
			consumed: group[1].length + 4
		};
	}
};
