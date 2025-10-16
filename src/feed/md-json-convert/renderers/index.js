/**
 * Index file for all renderers
 * Imports and exports all node and mark renderers
 */

// Node renderers
import { bulletList } from './bullet-list.js';
import { codeBlock } from './code-block.js';
import { doc } from './doc.js';
import { hardBreak } from './hard-break.js';
import { heading } from './heading.js';
import { infoBlock } from './info-block.js';
import { listItem } from './list-item.js';
import { orderedList } from './ordered-list.js';
import { paragraph } from './paragraph.js';
import { resource } from './resource.js';
import { tableCell } from './table-cell.js';
import { tableHeader } from './table-header.js';
import { tableRow } from './table-row.js';
import { table } from './table.js';
import { text } from './text.js';
import { warnBlock } from './warn-block.js';

// Mark renderers
import { bold } from './bold.js';
import { code } from './code.js';
import { link } from './link.js';
import { tagWarn } from './tag-warn.js';
import { tag } from './tag.js';

/**
 * Default renderers collection for converting JSON to Markdown
 */
export const defaultMarkdownRenderers = {
	// Node renderers
	doc,
	paragraph,
	text,
	heading,
	codeBlock,
	listItem,
	bulletList,
	orderedList,
	resource,
	table,
	tableRow,
	tableCell,
	tableHeader,
	hardBreak,
	infoBlock,
	warnBlock,

	// Mark renderers
	code,
	bold,
	link,
	'tag-warn': tagWarn,
	tag
};

/**
 * Export individual renderers for custom usage
 */
export {
	bold,
	bulletList,
	// Mark renderers
	code,
	codeBlock,
	// Node renderers
	doc,
	hardBreak,
	heading,
	infoBlock,
	link,
	listItem,
	orderedList,
	paragraph,
	resource,
	table,
	tableCell,
	tableHeader,
	tableRow,
	tag,
	tagWarn,
	text,
	warnBlock
};
