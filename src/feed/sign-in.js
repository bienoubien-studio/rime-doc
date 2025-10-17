
const headers = new Headers();
headers.set('host', process.env.PUBLIC_RIME_URL || 'http://localhost:5173');
headers.set('content-type', 'application/json');

/**
 *
 * @param {string} email
 * @param {string} password
 * @returns a headers with proper cookie, host, and content-type
 */
export const signIn = async (email, password) => {
	const response = await fetch(`${process.env.PUBLIC_RIME_URL}/api/auth/sign-in/email`, {
		method: 'POST',
		headers,
		body: JSON.stringify({
			email,
			password
		})
	});
	const setCookie = response.headers.get('set-cookie') || 'better-auth=foo';
	const [name, cookie] = setCookie.split('=');
	headers.set('Cookie', `${name}=${cookie}`);

	return headers;
};
