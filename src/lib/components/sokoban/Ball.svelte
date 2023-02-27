<script lang="ts">
	import { getContext } from './context';
	import { cellSize, colors, Direction } from './constants';

	export let index: number;
	export let position: number;
	export let target: number;

	const { getPosition, moveBall, getPossibleMoves } = getContext('sokoban');

	let dragPosition: number | null = null;

	$: _position = dragPosition || position;

	$: [cellX, cellY] = getPosition(_position);

	$: isAtTarget = position === target;

	$: x = cellSize * cellX - (cellX + 1);
	$: y = cellSize * cellY - (cellY + 1);

	let mouseDown: number[] | null = null;
	let mouse: number[] = [];
	let possibleMoves: number[] | null;

	function handleMouseDown(e: MouseEvent) {
		mouseDown = [e.clientX, e.clientY];
		possibleMoves = getPossibleMoves(index);
	}

	function handleMouseUp() {
		if (!mouseDown) return;

		const [x, y] = [mouseDown[0] - mouse[0], mouseDown[1] - mouse[1]];
		mouseDown = null;
		dragPosition = null;
		if (Math.hypot(x, y) < cellSize / 2) return;

		if (Math.abs(x) > Math.abs(y)) {
			moveBall(index, x < 0 ? Direction.RIGHT : Direction.LEFT);
		} else {
			moveBall(index, y > 0 ? Direction.UP : Direction.DOWN);
		}
	}

	function handleMouseMove(e: MouseEvent) {
		if (!mouseDown || !possibleMoves) return;

		mouse = [e.clientX, e.clientY];
		const [x, y] = [mouseDown[0] - mouse[0], mouseDown[1] - mouse[1]];
		if (Math.hypot(x, y) < cellSize / 2) {
			dragPosition = null;
			return;
		}
		if (Math.abs(x) > Math.abs(y)) {
			dragPosition = possibleMoves[x < 0 ? 1 : 3];
		} else {
			dragPosition = possibleMoves[y > 0 ? 0 : 2];
		}
	}

	function handleMouseLeave() {
		mouseDown = null;
		dragPosition = null;
	}
</script>

<div
	class="ball-wrapper"
	style={`--x: ${x}px; --y: ${y}px;`}
	on:mousedown={handleMouseDown}
	class:hovered={mouseDown}
>
	<div
		class="ball"
		class:isAtTarget
		style={`
    --color: var(--${colors[index]}50);
    --color-light: var(--${colors[index]}0);
    --color-dark: var(--${colors[index]}300);
`}
	/>
</div>

<svelte:window
	on:mouseup={handleMouseUp}
	on:mousemove={handleMouseMove}
	on:mouseleave={handleMouseLeave}
/>

<style>
	.ball-wrapper {
		position: absolute;
		width: var(--cell-size);
		height: var(--cell-size);
		transform: translate(var(--x), var(--y)) scale(1);
		transition: transform 0.5s, opacity 0.5s;
		display: grid;
		place-items: center;
		z-index: 5;
	}

	.ball {
		z-index: 1;
		cursor: pointer;
		opacity: 0.8;
		border-radius: 100%;
		transition: transform 0.5s, box-shadow 0.3s ease;
		width: calc(var(--cell-size) * 0.5);
		transform-origin: center;
		height: calc(var(--cell-size) * 0.5);
		user-select: none;
		background-color: var(--color);
		box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25), inset -4px -4px 8px var(--color-dark),
			inset 4px 4px 4px var(--color-light);
	}
	.hovered .ball {
		transform: scale(1.2);
		box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.25), inset -4px -5px 8px var(--color-dark),
			inset 6px 6px 6px var(--color-light);
	}

	.isAtTarget {
		transform: scale(0.9);
		opacity: 1;
	}
</style>
