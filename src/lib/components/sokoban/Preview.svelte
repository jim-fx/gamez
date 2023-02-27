<script lang="ts">
	import { decodeSokobanBoard, type BoardState } from './core';

	export let level: string;
	$: state = decodeSokobanBoard(level);

	function getCell(x: number, y: number) {
		if (x >= state.width || y > state.height || x < 0 || y < 0) {
			return 0;
		}
		return state.cells[y * state.width + x];
	}

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
</script>

<div class="grid" style={`--width: ${state.width}; --height: ${state.height};`}>
	{#each state.cells as cell, i}
		<div
			class="cell"
			class:visible={cell === 1}
			style={`--border-radius: ${calculateBorderRadius(i)}`}
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

	.cell {
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
