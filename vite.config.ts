import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import pkg from './package.json' with { type: 'json' };

export default defineConfig({
	plugins: [
		sveltekit({
			adapter: adapter(),
			preprocess: vitePreprocess(),
			appDir: 'app',
			paths: {
				base:
					process.env.NODE_ENV === 'production'
						? ((process.env.BASE_PATH ?? '') as '' | `/${string}`)
						: ''
			},
			version: {
				name: pkg.version,
				pollInterval: 0
			}
		})
	]
});
