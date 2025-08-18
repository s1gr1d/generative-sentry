import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': resolve(fileURLToPath(new URL('./src', import.meta.url))),
		},
	},
	css: {
		modules: {
			// Generate scoped class names for CSS modules
			generateScopedName: '[name]__[local]___[hash:base64:5]',
			// Opt into CSS modules for files ending with .module.css
			localsConvention: 'camelCaseOnly',
		},
	},
});
