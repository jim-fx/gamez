<script lang="ts">
	import Cell from './Cell.svelte';

	export let grid: (number | null)[] = [];
	export let custom: (number | null)[] = [];
</script>

<div class="sudoku-wrapper">
	{#each grid as cell, i}
		<Cell index={i} value={cell || custom[i]} initialValue={grid[i]} />
	{/each}
</div>

<style>
	.sudoku-wrapper {
		position: relative;
		display: grid;
		user-select: none;
		grid-template-columns: repeat(9, 1fr);
		grid-template-rows: repeat(9, 1fr);
	}
</style>
