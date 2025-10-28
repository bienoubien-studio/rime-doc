import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import { markdownToJson } from './md-json-convert/index.js';
import { signIn } from './sign-in.js';

const root = process.cwd();
const mdDir = path.join(root, 'docs');

const headers = await signIn(process.env.FEED_USER || '', process.env.FEED_PASSWORD || '');

interface FileEntry {
	slug: string;
	uri: string;
	path: string;
	content: string;
	position: number;
	parent: string | null;
}

interface PageDoc {
	id: string;
	url?: string;
	attributes?: {
		slug: string;
		title: string;
		longTitle: string;
	};
}

interface ApiResponse<T> {
	docs: T[];
	doc?: T;
}

interface PageCreateData {
	_position: number;
	attributes: {
		title: string;
		slug: string;
		longTitle: string;
	};
	content: {
		text: any;
	};
	_parent?: string;
}

interface PageUpdateData {
	_position: number;
	content: {
		text: any;
	};
}

/**
 * Extracts the position from a filename by getting the last non-zero number in the prefix.
 * If the last number is all zeros, use the previous non-zero number.
 * @example
 * extractPosition('03-00-configuration.md') // 3
 * extractPosition('128-01-00-installation.md') // 1
 * extractPosition('128-00-00-config.md') // 128
 * extractPosition('04-0128-something.md') // 128
 * @param filename - The filename to parse
 * @returns The last non-zero number in the prefix as integer
 */
function extractPosition(filename: string): number {
	// Extract all numbers from the beginning of the filename
	const match = filename.match(/^(\d+(?:-\d+)*)/);
	if (!match) {
		return 0;
	}

	const numbers = match[1].split('-');

	// Go backwards through the numbers to find the first non-zero one
	for (let i = numbers.length - 1; i >= 0; i--) {
		const num = parseInt(numbers[i], 10);
		if (num !== 0) {
			return num;
		}
	}

	// If all numbers are zero, return 0
	return 0;
}

/**
 * Converts a file path with numeric prefixes to a clean URI path.
 * Removes numeric prefixes, converts double underscores to slashes, and removes file extensions.
 * @param filePath - the file path
 * @example
 * convertPathToUri('03-01-configuration__collections.md') // 'configuration/collections'
 * convertPathToUri('02-installation.md') // 'installation'
 * convertPathToUri('03-00-configuration') // 'configuration'
 */
export function convertPathToUri(filePath: string): string {
	return filePath
		.replace(/^\d+-\d*-?/, '') // Remove numeric prefix (e.g., '03-01-', '02-', '03-00-')
		.replace(/__/g, '/') // Convert double underscores to forward slashes
		.replace(/\.md$/, ''); // Remove .md extension
}

/**
 * Scans a directory recursively and returns file entries
 * @param dir - the directory to scan
 * @returns set of files with info
 */
function scanDir(dir: string): Set<FileEntry> {
	const files = new Set<FileEntry>();
	const entries = readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			const subFiles = scanDir(fullPath);
			subFiles.forEach((file) => files.add(file));
		} else if (!entry.name.includes('DS_Store')) {
			const relative = path.relative(mdDir, fullPath);
			const uri = convertPathToUri(relative);
			const parent = uri.split('/').length > 1 ? uri.split('/').at(-2) || null : null;
			const content = readFileSync(fullPath, { encoding: 'utf-8' });

			files.add({
				slug: uri.split('/').at(-1) || '',
				parent,
				position: extractPosition(entry.name),
				content,
				uri,
				path: relative
			});
		}
	}
	return files;
}

/**
 * Gets a parent page by slug
 */
async function getParent(slug: string): Promise<PageDoc | null> {
	const response = await fetch(
		`${process.env.PUBLIC_RIME_URL}/api/pages?where[attributes.slug][equals]=${slug}`,
		{
			method: 'GET',
			headers
		}
	);

	if (response.status === 200) {
		const data: ApiResponse<PageDoc> = await response.json();
		if (!data.docs.length) return null;
		return data.docs[0];
	}
	return null;
}

/**
 * Capitalizes a string
 */
export const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Creates a new page
 */
async function createPage(file: FileEntry): Promise<string> {
	console.log(1);
	let parent: PageDoc | null = null;

	if (file.parent) {
		parent = await getParent(file.parent);
		if (!parent) throw new Error(`Parent ${file.parent} don't exists`);
	}

	const content = await markdownToJson(file.content);

	const baseData: PageCreateData = {
		_position: file.position,
		attributes: {
			title: capitalize(file.slug),
			slug: file.slug,
			longTitle: capitalize(file.slug)
		},
		content: {
			text: content
		}
	};

	const data = parent ? { ...baseData, _parent: parent.id } : baseData;

	const response = await fetch(`${process.env.PUBLIC_RIME_URL}/api/pages`, {
		method: 'POST',
		body: JSON.stringify(data),
		headers
	});

	if (response.status !== 200) {
		throw new Error(`Error while creating /${file.uri}`);
	}

	const result: ApiResponse<PageDoc> = await response.json();
	return result.doc?.id || '';
}

/**
 * Updates an existing page
 */
async function updatePage(file: FileEntry, id: string): Promise<void> {
	const content = await markdownToJson(file.content);
	const data: PageUpdateData = {
		_position: file.position,
		content: {
			text: content
		}
	};

	const response = await fetch(`${process.env.PUBLIC_RIME_URL}/api/pages/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(data),
		headers
	});

	if (response.status === 200) {
		console.log(`[√] /${file.uri} updated`);
	} else {
		console.log(response);
		throw new Error(`Error with ${file.uri}`);
	}
}

export const feed = async (): Promise<void> => {
	async function run(): Promise<void> {
		await fetch(`${process.env.PUBLIC_RIME_URL}/api/pages`, {
			method: 'DELETE',
			headers
		});

		const files = scanDir(mdDir);
		const uriMapId = new Map<string, string>();

		// First pass: check existing pages and create missing ones
		for (const file of Array.from(files)) {
			const docUrl = `${process.env.PUBLIC_RIME_URL}/docs/${file.uri}`;
			const response = await fetch(
				`${process.env.PUBLIC_RIME_URL}/api/pages?where[url][equals]=${docUrl}`,
				{
					method: 'GET',
					headers
				}
			);

			if (response.status === 200) {
				const data: ApiResponse<PageDoc> = await response.json();
				if (!data.docs.length) {
					console.warn(docUrl, 'not found -> create');
					const id = await createPage(file);
					uriMapId.set(file.uri, id);
				} else {
					uriMapId.set(file.uri, data.docs[0].id);
				}
			}
		}

		// Second pass: update all pages
		for (const file of Array.from(files)) {
			const id = uriMapId.get(file.uri);
			if (!id) {
				throw new Error(`Missing /${file.uri} id in Map`);
			}
			await updatePage(file, id);
		}
	}

	try {
		await run();
	} catch (err) {
		console.log(err);
	}
};

if (require.main === module) {
	feed();
}
