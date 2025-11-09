import { sveltekit } from '@sveltejs/kit/vite';
import { rime } from 'rimecms/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [rime(), sveltekit()]
});
