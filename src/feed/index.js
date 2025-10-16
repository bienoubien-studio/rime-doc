import { readFileSync } from 'fs';
import path from 'path';
import { markdownToJson } from './md-json-convert/index.js';

const root = process.cwd();
const srcDir = path.join(root, 'src', 'feed', 'src');
const jsonDir = path.join(root, 'src', 'feed', 'json');
const mdDir = path.join(root, 'src', 'feed', 'md');

const headers = new Headers();
headers.set('host', process.env.PUBLIC_RIME_URL);
headers.set('content-type', 'application/json');

export const signIn = async (email, password) => {
	const response = await fetch(`${process.env.PUBLIC_RIME_URL}/api/auth/sign-in/email`, {
		method: 'POST',
		headers,
		body: JSON.stringify({
			email,
			password
		})
	});
	const setCookie = response.headers.get('set-cookie');

	const [name, cookie] = setCookie.split('=');

	return `${name}=${cookie}`;
};

export const feed = async () => {
	async function run() {
		const res = await fetch(`${process.env.PUBLIC_RIME_URL}/api/pages`);
		const { docs } = await res.json();

		for (const doc of docs) {
			const slug = doc.attributes.slug;
			const jsonData = doc.content.text;
			const markdown = jsonToMarkdown(jsonData);
			const backToJson = markdownToJson(markdown);
			writeFileSync(path.join(srcDir, `${slug}.json`), JSON.stringify(jsonData, null, 2));
			writeFileSync(path.join(mdDir, `${slug}.md`), markdown);
			writeFileSync(path.join(jsonDir, `${slug}-back.json`), JSON.stringify(backToJson));
		}

		const cookie = await signIn(process.env.FEED_USER, process.env.FEED_PASSWORD);
		headers.set('Cookie', cookie);

		const md = readFileSync(path.join(mdDir, 'configuration.md'), 'utf-8');
		const json = markdownToJson(md);

		await fetch(`${process.env.PUBLIC_RIME_URL}/api/pages`, {
			method: 'POST',
			headers,
			body: JSON.stringify({
				attributes: {
					title: 'bar',
					slug: 'bar'
				},
				content: {
					text: json
				}
			})
		});
	}

	try {
		run();
	} catch (err) {
		console.log(err);
	}
};

feed();
