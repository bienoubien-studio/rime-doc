/**
 * Tag mark renderer - handles {!text!} formatting
 */

export const tagWarnRenderer = {
	type: 'mark',
	inline: true,
	matcher: /\{!([^}!]+)!\}/,

	/**
	 * Checks if markdown text contains tagWarn formatting
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
				marks: [{ type: 'tag-warn' }],
				text: group[1],
				type: 'text'
			},
			consumed: group[1].length + 4
		};
	}
};
