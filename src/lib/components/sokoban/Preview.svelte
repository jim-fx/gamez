<script lang="ts">
	import { colors } from './constants';
	import { decodeSokobanBoard } from './core';
	import { arrayToMap } from './utils';

	export let level: string;
	$: state = decodeSokobanBoard(level);

	function getCell(x: number, y: number) {
		if (x >= state.width || y > state.height || x < 0 || y < 0) {
			return 0;
		}
		return state.cells[y * state.width + x];
	}

	$: balls = arrayToMap(state.balls.map((b) => b.start));
	$: targets = arrayToMap(state.balls.map((b) => b.target));
	$: console.log(balls, targets);

	const borderR = '5px';
	const none = '0px';
	function calculateBorderRadius(index: number) {
		const x = index % state.width;
		const y = Math.floor(index / state.width);

		const hasCellAbove = getCell(x, y - 1);
		const hasCellBelow = getCell(x, y + 1);
		const hasCellLeft = getCell(x - 1, y);
		const hasCellRight = getCell(x + 1, y);

		return ` ${hasCellAbove || hasCellLeft ? none : borderR} 
        ${hasCellAbove || hasCellRight ? none : borderR} 
        ${hasCellRight || hasCellBelow ? none : borderR} 
        ${hasCellBelow || hasCellLeft ? none : borderR};`;
	}

	function getColor(index: number) {
		if (balls.has(index)) {
			return `color: var(--${colors[balls.get(index)]}50);`;
		}
		if (targets.has(index)) {
			return `color: var(--${colors[targets.get(index)]}50);`;
		}
		return '';
	}
</script>

<div class="grid" style={`--width: ${state.width}; --height: ${state.height};`}>
	{#each state.cells as cell, i}
		<div
			class="cell"
			class:visible={cell === 1}
			class:ball={balls.has(i)}
			class:target={targets.has(i)}
			style={`
        --border-radius: ${calculateBorderRadius(i)}; 
        ${getColor(i)}
`}
		/>
	{/each}
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(var(--width), 1fr);
		grid-template-rows: repeat(var(--height), 1fr);
		grid-gap: 0;
		width: fit-content;
	}

	.ball::after {
		background: currentColor;
	}

	.target::after,
	.ball::after {
		content: '';
		position: absolute;
		width: 60%;
		height: 60%;
		top: 20%;
		left: 20%;
		border-radius: 50%;
	}

	.target::after {
		border: 2px solid currentColor;
		box-sizing: border-box;
	}

	.cell {
		position: relative;
		width: 10px;
		height: 10px;
		margin-left: -1px;
		margin-top: -1px;
		border-radius: var(--border-radius);
	}
	.cell.visible {
		border: 1px solid var(--outline);
		background: var(--neutral800);
	}
</style>
