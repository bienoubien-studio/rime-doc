import autoprefixer from 'autoprefixer';
import mixins from 'postcss-mixins';

export default {
	plugins: [
		mixins({
			mixinsDir: './src/lib/styles/mixins'
		}),
		autoprefixer
	]
};
