<script lang="ts">
	import { writable, derived } from 'svelte/store';
	import RadialMenu from '../RadialMenu.svelte';
	import { setContext, type Context } from './context';
	import Grid from './Grid.svelte';
	import { checkIfWon, findSudokuErrors } from './utils';

	export let grid: number[] = [];
	export let custom: number[] = Array({ length: 81 }).map(() => 0);
	export let won = false;

	$: errors = findSudokuErrors(grid, custom);
	$: won = errors.length === 0 && checkIfWon(grid, custom);

	const activeIndex = writable(-1);
	const hoveredIndex = writable(-1);
	const hoveredValue = derived([hoveredIndex], (index) => {
		return custom[index[0]] || grid[index[0]] || 0;
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
			if (grid[i] !== 0) return;
			const c = [...custom];
			c[i] = typeof value === 'string' ? parseInt(value) : value;
			custom = c;
		},
		getCell: (i) => {
			return grid[i] || custom[i];
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
		const i = $activeIndex;
		if (i === -1) return;
		if (grid[i] !== 0) return;
		context.setCell(i, value);
		$activeIndex = -1;
	}
</script>

<RadialMenu rotation={180} target={checkTarget} {items} on:select={handleSelect} />
<svelte:window on:mouseup={() => context.activeIndex.set(-1)} />

<Grid {grid} bind:custom {errors} />
