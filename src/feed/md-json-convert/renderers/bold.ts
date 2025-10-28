/**
 * Bold mark renderer - handles **text** formatting
 * Self-responsible renderer that matches, parses, and renders bold marks
 */

export const boldRenderer = {
	type: 'mark',
	inline: true,
	matcher: /\*\*([^*]+)\*\*/,

	/**
	 * Checks if markdown text contains bold formatting
	 */
	match(input: string) {
		return input.match(this.matcher);
	},

	/**
	 * Converts bold match to JSON mark
	 */
	renderJSON(input: string) {
		const group = input.match(this.matcher); // Remove ** and **

		if (!group) return null;

		return {
			node: {
				marks: [{ type: 'bold' }],
				text: group[1],
				type: 'text'
			},
			consumed: group[1].length + 4
		};
	}
};
