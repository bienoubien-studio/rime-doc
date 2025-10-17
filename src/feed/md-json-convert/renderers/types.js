/**
 * @fileoverview Shared JSDoc type definitions for markdown renderers
 */

/**
 * @typedef {Object} TextNode
 * @property {string} type - The node type (always 'text')
 * @property {string} text - The text content
 * @property {Array<MarkNode>} [marks] - Optional formatting marks
 */

/**
 * @typedef {Object} MarkNode
 * @property {string} type - The mark type (e.g., 'bold', 'code', 'link', 'tag', 'tag-warn')
 * @property {Object} [attrs] - Optional attributes for the mark
 */

/**
 * @typedef {Object} LinkMarkNode
 * @property {string} type - The mark type ('link')
 * @property {Object} attrs - Link attributes
 * @property {string} attrs.href - The link URL
 * @property {null} attrs.class - CSS class (always null)
 * @property {string} attrs.rel - Link relationship
 * @property {string} attrs.target - Link target
 */

/**
 * @typedef {Object} TagMarkNode
 * @property {string} type - The mark type ('tag')
 * @property {Object} attrs - Tag attributes
 * @property {string} attrs.type - Tag type (e.g., 'info')
 */

/**
 * @typedef {Object} ParagraphNode
 * @property {string} type - The node type ('paragraph')
 * @property {Array<TextNode>} content - Array of text nodes
 */

/**
 * @typedef {Object} HeadingNode
 * @property {string} type - The node type ('heading')
 * @property {Object} attrs - Heading attributes
 * @property {number} attrs.level - Heading level (1-6)
 * @property {Array<TextNode>} content - Array of text nodes
 */

/**
 * @typedef {Object} CodeBlockNode
 * @property {string} type - The node type ('codeBlock')
 * @property {Object} attrs - Code block attributes
 * @property {string} attrs.language - Programming language
 * @property {Array<TextNode>} content - Array of text nodes
 */

/**
 * @typedef {Object} ListItemNode
 * @property {string} type - The node type ('listItem')
 * @property {Array<ParagraphNode>} content - Array of paragraph nodes
 */

/**
 * @typedef {Object} BulletListNode
 * @property {string} type - The node type ('bulletList')
 * @property {Array<ListItemNode>} content - Array of list item nodes
 */

/**
 * @typedef {Object} OrderedListNode
 * @property {string} type - The node type ('orderedList')
 * @property {Object} attrs - List attributes
 * @property {number} attrs.start - Starting number
 * @property {null} attrs.type - List type (always null)
 * @property {Array<ListItemNode>} content - Array of list item nodes
 */

/**
 * @typedef {Object} TableCellNode
 * @property {string} type - The node type ('tableCell' or 'tableHeader')
 * @property {Object} attrs - Cell attributes
 * @property {number} attrs.colspan - Column span
 * @property {null} attrs.colwidth - Column width (always null)
 * @property {number} attrs.rowspan - Row span
 * @property {Array<ParagraphNode>} content - Array of paragraph nodes
 */

/**
 * @typedef {Object} TableRowNode
 * @property {string} type - The node type ('tableRow')
 * @property {Array<TableCellNode>} content - Array of table cell nodes
 */

/**
 * @typedef {Object} TableNode
 * @property {string} type - The node type ('table')
 * @property {Array<TableRowNode>} content - Array of table row nodes
 */

/**
 * @typedef {Object} ResourceNode
 * @property {string} type - The node type ('resource')
 * @property {Object} attrs - Resource attributes
 * @property {string} attrs.id - Resource ID
 * @property {string} attrs._type - Resource type
 * @property {Object} resource - Resource reference
 * @property {string} resource.id - Resource ID reference
 */

/**
 * @typedef {Object} HardBreakNode
 * @property {string} type - The node type ('hardBreak')
 */

/**
 * @typedef {Object} InfoBlockNode
 * @property {string} type - The node type ('infoBlock')
 * @property {Array<ParagraphNode>} content - Array of paragraph nodes
 */

/**
 * @typedef {Object} WarnBlockNode
 * @property {string} type - The node type ('warnBlock')
 * @property {Array<ParagraphNode>} content - Array of paragraph nodes
 */

/**
 * @typedef {Object} DocNode
 * @property {string} type - The node type ('doc')
 * @property {Array<AnyNode>} content - Array of any content nodes
 */

/**
 * @typedef {TextNode|ParagraphNode|HeadingNode|CodeBlockNode|ListItemNode|BulletListNode|OrderedListNode|TableNode|TableRowNode|TableCellNode|ResourceNode|HardBreakNode|InfoBlockNode|WarnBlockNode|DocNode} AnyNode
 */

/**
 * @typedef {Record<string, (node: AnyNode, renderers: RendererMap) => string>} RendererMap
 */

/**
 * @typedef {Record<string, (text: string, mark: MarkNode) => string>} MarkRendererMap
 */

/**
 * @typedef {Object} ParseResult
 * @property {AnyNode} node - The parsed node
 * @property {number} endIndex - The ending line index
 */

/**
 * @typedef {Array<TextNode>} TextNodeArray
 */

/**
 * @typedef {Array<string>} MarkdownLines
 */
