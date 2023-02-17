<script lang="ts">
	import { getContext } from './context';
	import { colors, Direction } from './constants';

	export let index: number;
	export let position: number;
	export let target: number;

	const { getPosition, moveBall } = getContext('sokoban');

	$: [cellX, cellY] = getPosition(position);

	$: isAtTarget = position === target;

	$: x = 40 * cellX + 5;
	$: y = 40 * cellY + 5;

	let mouseDown: number[] | null = null;
	let mouse: number[] = [];

	function handleMouseDown(e: MouseEvent) {
		mouseDown = [e.clientX, e.clientY];
	}

	function handleMouseUp() {
		if (!mouseDown) return;

		const [x, y] = [mouseDown[0] - mouse[0], mouseDown[1] - mouse[1]];
		if (Math.abs(x) > Math.abs(y)) {
			moveBall(index, x < 0 ? Direction.RIGHT : Direction.LEFT);
		} else {
			moveBall(index, y > 0 ? Direction.UP : Direction.DOWN);
		}

		mouseDown = null;
	}

	function handleMouseMove(e: MouseEvent) {
		mouse = [e.clientX, e.clientY];
	}
</script>

<div
	class="ball"
	class:isAtTarget
	on:mousedown={handleMouseDown}
	style={`--x: ${x}px; --y: ${y}px; background-color: ${colors[index]};`}
/>

<svelte:window on:mouseup={handleMouseUp} on:mousemove={handleMouseMove} />

<style>
	.ball {
		position: absolute;
		z-index: 1;
		opacity: 0.8;
		border-radius: 100%;
		transition: transform 0.5s;
		width: calc(var(--cell-size) - 10px);
		height: calc(var(--cell-size) - 10px);
		transition: transform 0.5s, opacity 0.5s;
		transform-origin: center;
		user-select: none;
		transform: translate(var(--x), var(--y)) scale(1);
	}

	.isAtTarget {
		transform: translate(var(--x), var(--y)) scale(0.5);
		opacity: 1;
	}
</style>
