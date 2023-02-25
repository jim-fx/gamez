<script lang="ts">
	import { getContext } from './context';
	import { colors, Direction } from './constants';

	export let index: number;
	export let position: number;
	export let target: number;

	const { getPosition, moveBall } = getContext('sokoban');

	$: [cellX, cellY] = getPosition(position);

	$: isAtTarget = position === target;

	$: x = 80 * cellX - 1;
	$: y = 80 * cellY;

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

<div class="ball-wrapper" style={`--x: ${x}px; --y: ${y}px;`} on:mousedown={handleMouseDown}>
	<div class="ball" class:isAtTarget style={`background-color: ${colors[index]};`} />
</div>

<svelte:window on:mouseup={handleMouseUp} on:mousemove={handleMouseMove} />

<style>
	.ball-wrapper {
		position: absolute;
		width: var(--cell-size);
		height: var(--cell-size);
		transform: translate(var(--x), var(--y)) scale(1);
		transition: transform 0.5s, opacity 0.5s;
		display: grid;
		place-items: center;
	}

	.ball {
		z-index: 1;
		opacity: 0.8;
		border-radius: 100%;
		transition: transform 0.5s;
		width: calc(var(--cell-size) * 0.5);
		transform-origin: center;
		height: calc(var(--cell-size) * 0.5);
		user-select: none;
	}

	.isAtTarget {
		transform: scale(0.8);
		opacity: 1;
	}
</style>
