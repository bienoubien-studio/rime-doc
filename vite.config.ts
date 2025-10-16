import { sveltekit } from '@sveltejs/kit/vite';
import { rime } from '@bienbien/rime/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [rime(), sveltekit()]
});
