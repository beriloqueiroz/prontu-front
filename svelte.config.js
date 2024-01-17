import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		csrf: {
      checkOrigin: false
      // checkOrigin: process.env.NODE_ENV === 'development' ? false : true
    }
	}
};

export default config;
