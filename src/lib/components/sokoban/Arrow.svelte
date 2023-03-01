<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { cellSize } from './constants';
	import { fade } from 'svelte/transition';

	export let width: number = 5;
	export let height: number = 5;

	export let start: number;
	export let end: number;
	export let color: string = 'red';

	let _color = color;
	$: if (color && color !== _color) {
		_color = color;
	}

	let visible = false;
	let animationDone = false;

	let arrowProps = calculateArrowProps();

	function calculateArrowProps() {
		const startX = start % width;
		const startY = Math.floor(start / width);

		const endX = end % width;
		const endY = Math.floor(end / width);

		const x1 = startX * cellSize + cellSize / 2 - 1;
		const x2 = endX * cellSize + cellSize / 2 - 1;

		const y1 = startY * cellSize + cellSize / 2 - 1;
		const y2 = endY * cellSize + cellSize / 2 - 1;

		const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

		return {
			'stroke-dasharray': length,
			'stroke-dashoffset': length,
			style: '--length: ' + -length + ';',
			x1,
			y1,
			x2,
			y2
		};
	}

	onMount(() => {
		setTimeout(() => {
			animationDone = true;
		}, 1100);
		setTimeout(() => {
			visible = true;
		}, 10);
	});
</script>

<svg
	fill="none"
	out:fade
	viewBox="0 0 {width * cellSize} {height * cellSize}"
	xmlns="http://www.w3.org/2000/svg"
	style={`color: var(--${_color}50)`}
	class:visible
	class:animationDone
>
	<defs>
		<linearGradient
			id="arrow-gradient"
			x1={arrowProps?.x1}
			y1={arrowProps?.y1}
			x2={arrowProps?.x2}
			y2={arrowProps?.y2}
			gradientUnits="userSpaceOnUse"
		>
			<stop offset="0%" stop-color="transparent" />
			<stop offset="100%" stop-color="currentColor" />
		</linearGradient>
		<marker
			xmlns="http://www.w3.org/2000/svg"
			id="triangle"
			viewBox="0 0 10 10"
			overflow="visible"
			refX="5"
			refY="5"
			markerUnits="strokeWidth"
			markerWidth="5"
			markerHeight="5"
			orient="auto"
		>
			<path d="M 0 0 L 6 5 L 0 10" />
		</marker>
	</defs>
	<line {...arrowProps} />
</svg>

<style>
	svg {
		pointer-events: none;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		transition: opacity 0.3s;
		opacity: 0;
	}

	svg.visible {
		opacity: 1;
	}

	line {
		stroke-width: 3;
		stroke: url(#arrow-gradient);
		marker-end: url(#triangle);
		transition: stroke-dashoffset 0.7s ease;
	}
	.visible line {
		stroke-dashoffset: 0 !important;
	}

	.animationDone line {
		stroke-dashoffset: var(--length);
	}

	marker > path {
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 2;
		stroke: currentColor;
		fill: none;
		opacity: 0;
		transition: opacity 0.3s;
		transition-delay: 0.5s;
	}
	.visible marker > path {
		opacity: 1;
	}
	.animationDone marker > path {
		transition-delay: 0s !important;
	}
</style>
