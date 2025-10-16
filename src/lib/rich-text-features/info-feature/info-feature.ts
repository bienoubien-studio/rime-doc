import type { RichTextFeature, RichTextFeatureNode } from '@bienbien/rime/types';
import { Info } from '@lucide/svelte';
import { mergeAttributes } from '@tiptap/core';
import Blockquote from '@tiptap/extension-blockquote';
import './info-feature.css';

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		infoBlock: {
			/**
			 * Set a blockquote node
			 */
			setInfoBlock: () => ReturnType;
			/**
			 * Toggle a blockquote node
			 */
			toggleInfoBlock: () => ReturnType;
			/**
			 * Unset a blockquote node
			 */
			unsetInfoBlock: () => ReturnType;
		};
	}
}

const InfoBlock = import.meta.env.SSR
	? undefined
	: Blockquote.extend({
			name: 'infoBlock',
			// @ts-expect-error https://github.com/ueberdosis/tiptap/issues/6670
			renderHTML({ HTMLAttributes }) {
				return ['blockquote', mergeAttributes(HTMLAttributes, { 'data-type': 'info' }), 0];
			},
			addAttributes() {
				// @ts-expect-error https://github.com/ueberdosis/tiptap/issues/6670
				return { ...this.parent?.(), dataType: { default: 'info' } };
			},
			addCommands() {
				return {
					setInfoBlock:
						() =>
						// @ts-expect-error https://github.com/ueberdosis/tiptap/issues/6670
						({ commands }) => {
							return commands.setMark(this.name);
						},
					toggleInfoBlock:
						() =>
						// @ts-expect-error https://github.com/ueberdosis/tiptap/issues/6670
						({ commands }) => {
							return commands.toggleWrap(this.name);
						},
					unsetInfoBlock:
						() =>
						// @ts-expect-error https://github.com/ueberdosis/tiptap/issues/6670
						({ commands }) => {
							return commands.lift(this.name);
						}
				};
			}
		});

const infoBlock: RichTextFeatureNode = {
	label: 'Info block',
	icon: Info,
	suggestion: {
		command: ({ editor }) => editor.chain().focus().toggleInfoBlock().run()
	},
	nodeSelector: {
		command: ({ editor }) => editor.chain().focus().toggleInfoBlock().run()
	},
	isActive: ({ editor }) => editor.isActive('infoBlock')
};

export const infoBlockFeature: RichTextFeature = {
	extension: InfoBlock,
	nodes: [infoBlock]
};
