<script lang="ts">
	import { setContext } from 'svelte';
	import { derived, writable } from 'svelte/store';
	import RadialMenu from '../RadialMenu.svelte';
	import Cell from './Cell.svelte';
	import type { Context } from './context';

	export let grid: (number | null)[] = [];

	let initialGrid: (number | null)[] | null = null;
	$: if (initialGrid === null && grid) {
		console.log('initializing grid');
		initialGrid = [...grid];
	}

	const activeIndex = writable(-1);
	const hoveredIndex = writable(-1);
	const hoveredValue = derived([hoveredIndex], (index) => {
		return grid[index[0]] || -1;
	});

	export const context: Context = {
		activeIndex,
		hoveredIndex,
		hoveredValue,
		toggleActive: (i) => {
			context.activeIndex.update((v) => {
				if (v === i) {
					return -1;
				}
				return i;
			});
		},
		getPosition: (i) => {
			const row = Math.floor(i / 9);
			const col = i % 9;
			return [row, col];
		},
		setCell: (i, value) => {
			grid[i] = typeof value === 'string' ? parseInt(value) : value;
			grid = [...grid];
		},
		getCell: (i) => {
			return grid[i];
		},
		getCellIndex: (row, col) => {
			return row * 9 + col;
		}
	};
	setContext('grid', context);

	const items = [
		{ value: null, icon: 'x' },
		...Array(9)
			.fill(null)
			.map((_, i) => {
				return {
					content: i + 1 + '',
					value: i + 1 + ''
				};
			})
	];

	function checkTarget(e: HTMLElement) {
		return e.classList.contains('cell-wrapper');
	}

	function handleSelect(e: CustomEvent) {
		const value = e.detail;
		console.log($activeIndex, value, initialGrid);
		const i = $activeIndex;
		if (i === -1) return;
		if (initialGrid && typeof initialGrid[i] === 'number') return;
		context.setCell(i, value);
		$activeIndex = -1;
	}
</script>

<RadialMenu rotation={180} target={checkTarget} {items} on:select={handleSelect} />
<svelte:window on:mouseup={() => context.activeIndex.set(-1)} />

<div class="sudoku-wrapper">
	{#each grid as cell, i}
		<Cell index={i} value={cell} initialValue={initialGrid && initialGrid[i]} />
	{/each}
</div>

<style>
	.sudoku-wrapper {
		position: relative;
		display: grid;
		user-select: none;
		grid-template-columns: repeat(9, 1fr);
		grid-template-rows: repeat(9, 1fr);
		border: 1px solid black;
		width: fit-content;
		height: fit-content;
		box-sizing: border-box;
		border-radius: 20px;
		overflow: hidden;

		background-image: linear-gradient(-20deg, #16161e 3.85%, #252530 96.92%);
		background-blend-mode: screen;

		box-shadow: 8px 8px 32px rgba(0, 0, 0, 0.25), 4px 4px 8px rgba(0, 0, 0, 0.2),
			inset 2px 2px 9px rgba(255, 255, 255, 0.05), inset -2px -2px 9px rgba(0, 0, 0, 0.2);

		/* Outline */
		outline: 1px solid var(--outline);
		border: none;
	}

	.sudoku-wrapper::after {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		background: url(/noise.png);
		pointer-events: none;
		opacity: 0.2;
	}
</style>
