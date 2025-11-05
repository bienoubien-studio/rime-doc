<script lang="ts">
	import { untrack } from 'svelte';

	let containerEl: HTMLDivElement;
	let canva = $state();

	let computedSizes = $state<Record<string, string>>({
		xs: '0px',
		sm: '0px',
		md: '0px',
		lg: '0px',
		xl: '0px',
		'2xl': '0px',
		'3xl': '0px',
		'4xl': '0px'
	});

	function updateComputedSizes() {
		if (!containerEl) return;

		// Create temporary elements with each font size to get computed pixel values
		const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
		const newSizes = {};

		sizes.forEach((size) => {
			const tempEl = document.createElement('div');
			tempEl.style.fontSize = `var(--text-fluid-${size})`;
			tempEl.style.position = 'absolute';
			tempEl.style.visibility = 'hidden';
			document.body.appendChild(tempEl);

			const computedFontSize = getComputedStyle(tempEl).fontSize;
			newSizes[size] = computedFontSize;

			document.body.removeChild(tempEl);
		});

		computedSizes = newSizes;
	}

	function onResize() {
		updateComputedSizes();
	}

	$effect(() => {
		untrack(() => {
			window.addEventListener('resize', onResize);
			// Initial computation
			updateComputedSizes();
		});
		return () => window.removeEventListener('resize', onResize);
	});

	let ctx = $state();
	$effect(() => {
		if (canva) {
			ctx = canva.getContext('2d');
		}
	});

	$effect(() => {
		if (ctx && canva && computedSizes) {
			draw();
		}
	});

	function draw() {
		const xs = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
		canva.width = xs.length * 20;
		canva.height = xs.length * 20;
		ctx.strokeStyle = 'white';
		ctx.clearRect(0, 0, canva.width, canva.height);
		// draw horizontal line
		ctx.beginPath();
		ctx.moveTo(0, canva.height);
		ctx.lineTo(canva.width, canva.height);
		ctx.stroke();
		// draw vertical line
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0, canva.height);
		ctx.stroke();
		// somehow end path before move
		ctx.beginPath();
		ctx.moveTo(0, canva.height - parseFloat(computedSizes[0]));
		for (const [i, x] of xs.entries()) {
			ctx.arc((i + 1) * 17, canva.height - parseFloat(computedSizes[x]) * 1.25, 2, 0, 2 * Math.PI);
			ctx.lineTo((i + 1) * 17, canva.height - parseFloat(computedSizes[x]) * 1.25);
		}
		ctx.stroke();
	}
</script>

<div class="debug-fonts" bind:this={containerEl}>
	<div>xs: {computedSizes.xs}</div>
	<div>sm: {computedSizes.sm}</div>
	<div>md: {computedSizes.md}</div>
	<div>lg: {computedSizes.lg}</div>
	<div>xl: {computedSizes.xl}</div>
	<div>2xl: {computedSizes['2xl']}</div>
	<div>3xl: {computedSizes['3xl']}</div>
	<div>4xl: {computedSizes['4xl']}</div>
	<canvas bind:this={canva} />
</div>

<style>
	canvas {
		width: 200px;
		height: 200px;
	}
	.debug-fonts {
		position: fixed;
		bottom: 2rem;
		left: 2rem;
		/*background-color: black;*/
		color: white;
	}
</style>
