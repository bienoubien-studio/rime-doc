import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import { markdownToJson } from './md-json-convert/index.js';
import { signIn } from './sign-in.js';

const root = process.cwd();
const mdDir = path.join(root, 'docs');

const headers = await signIn(process.env.FEED_USER || '', process.env.FEED_PASSWORD || '');

/**
 * @typedef {Object} FileEntry
 * @property {string} slug
 * @property {string} uri
 * @property {string} path
 * @property {string} content
 * @property {number} position
 * @property {string | null} parent
 */

 /**
  * Extracts the position from a filename by getting the last number in the prefix.
  * @example
  * extractPosition('99-32-03-configuration.md') // 3
  * extractPosition('2000-232-80-installation.md') // 80
  * extractPosition('00-2000-232-128-config.md') // 128
  * extractPosition('00-2000-232-0128-config.md') // 128
  * extractPosition('04-0128-something.md') // 128
  * @param {string} filename - The filename to parse
  * @returns {number} The last number in the prefix as integer
  */

  /**
   * Extracts the position from a filename by getting the last non-zero number in the prefix.
   * If the last number is all zeros, use the previous non-zero number.
   * @example
   * extractPosition('03-00-configuration.md') // 3
   * extractPosition('128-01-00-installation.md') // 1
   * extractPosition('128-00-00-config.md') // 128
   * extractPosition('04-0128-something.md') // 128
   * @param {string} filename - The filename to parse
   * @returns {number} The last non-zero number in the prefix as integer
   */
  function extractPosition(filename) {
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
 * @param {string} filePath - the file path
 * @example
 * convertPathToUri('03-01-configuration__collections.md') // 'configuration/collections'
 * convertPathToUri('02-installation.md') // 'installation'
 * convertPathToUri('03-00-configuration') // 'configuration'
 */
export function convertPathToUri(filePath) {
  return filePath
    .replace(/^\d+-\d*-?/, '') // Remove numeric prefix (e.g., '03-01-', '02-', '03-00-')
    .replace(/__/g, '/') // Convert double underscores to forward slashes
    .replace(/\.md$/, ''); // Remove .md extension
}

/**
 * Converts a file path with numeric prefixes to a clean URI path.
 * Removes numeric prefixes, converts double underscores to slashes, and removes file extensions.
 * @param {string} dir - the directory to scan
 * @return {Set<FileEntry>} - set of files with info
 * @example
 * convertPathToUri('03-01-configuration__collections.md') // 'configuration/collections'
 * convertPathToUri('02-installation.md') // 'installation'
 * convertPathToUri('03-00-configuration') // 'configuration'
 */
function scanDir (dir) {
  let files = new Set()
  const entries = readdirSync(dir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			scanDir(fullPath);
		} else if(!entry.name.includes('DS_Store')) {
		  const relative = path.relative(mdDir, fullPath)
		  const uri = convertPathToUri(relative)
			const parent = uri.split('/').length > 1 ? uri.split('/').at(-2) : null
		  const content = readFileSync(fullPath, { encoding: 'utf-8' })
			files.add({
			  slug: uri.split('/').at(-1),
			  parent,
				position: extractPosition(entry.name),
			  content,
			  uri,
			  path: relative
			});
		}
	}
	return files
}

/**
 *
 * @param {string} slug
 * @return {Promise<null | {id: string}>}
 */
async function getParent(slug){
  const response = await fetch(`${process.env.PUBLIC_RIME_URL}/api/pages?where[attributes.slug][equals]=${slug}`, {
		method: 'GET',
		headers
	});
  if(response.status === 200){
    const { docs } = await response.json()
    if(!docs.length) return null
    return docs[0]
  }
  return null
}

/**
 *
 * @param {FileEntry} file
 * @returns {Promise<string>} id
 */
async function createPage(file){
  let parent = null
  if(file.parent){
    parent = await getParent(file.parent)
    if(!parent) throw Error(`Parent ${file.parent} don't exists`)
  }
  const content = await markdownToJson(file.content)
  const baseData = {
      _position: file.position,
		  attributes: {
				title: file.slug,
				slug: file.slug,
			},
			content: {
			  text: content
			}
		}
  const data = parent ? {...baseData, _parent: parent.id } : baseData

  const response = await fetch(`${process.env.PUBLIC_RIME_URL}/api/pages`, {
		method: 'POST',
		body: JSON.stringify(data),
		headers
	});

  if(response.status !== 200) throw Error(`Error while creating /${file.uri}`)
  const { doc } = await response.json()
  return doc.id
}

/**
 *
 * @param {FileEntry} file
 * @param {string} id
 */
async function updatePage(file, id){
  const content = await markdownToJson(file.content)
  const data = {
    _position: file.position,
	  content: {
		  text: content
		}
  }
  const response = await fetch(`${process.env.PUBLIC_RIME_URL}/api/pages/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(data),
		headers
	});
  if(response.status === 200){
    console.log(`[√] /${file.uri} updated`)
  }else{
    console.log(response)
    throw new Error(`Error with ${file.uri}`)
  }
}

export const feed = async () => {
	//
  async function run() {

    // Get all to update urls
    await fetch(`${process.env.PUBLIC_RIME_URL}/api/pages`)

		const files = scanDir(mdDir)

		const uriMapId = new Map()
		for(const file of Array.from(files)){
		  const docUrl = `${process.env.PUBLIC_RIME_URL}/docs/${file.uri}`
			const response = await fetch(`${process.env.PUBLIC_RIME_URL}/api/pages?where[url][equals]=${docUrl}`, {
				method: 'GET',
				headers
			});
			if(response.status === 200){
			  const { docs } = await response.json()
				if(!docs.length){
				  console.warn(docUrl, 'not found -> create')
					const id = await createPage(file)
					uriMapId.set(file.uri, id)
				}else{
				  uriMapId.set(file.uri, docs[0].id)
				}
			}
		}

    for (const file of Array.from(files)) {
      const id = uriMapId.get(file.uri)
      if(!id) throw Error(`Missing /${file.uri} id in Map`)
      await updatePage(file, uriMapId.get(file.uri))
    }
	}

	try {
		run();
	} catch (err) {
		console.log(err);
	}
};

feed();
