<script lang="ts">
	import type { BoardState } from '../core';
	import Game from '../Game.svelte';
	import Grid from './Grid.svelte';
	import { arrayToMap } from '../utils';
	import Controls from './Controls.svelte';
	import { activeView } from './stores';

	export let state: BoardState;
	export let showIndex: boolean = false;

	let gameSteps = 0;
	let gameWon = false;

	$: if (state.cells.length) {
		state.balls = state.balls.map((b) => {
			if (b.target >= state.width * state.height || state.cells[b.target] === 0) {
				b.target = -1;
			}
			if (b.start >= state.width * state.height || state.cells[b.start] === 0) {
				b.start = -1;
			}
			return b;
		});
	}

	$: if (gameSteps !== 0 && gameWon && state.steps.best > gameSteps) {
		state.steps.best = gameSteps;
	}

	$: balls = arrayToMap(
		state.balls.map((b) => b.start).filter((v) => v > -1 && typeof v === 'number')
	);
	$: targets = arrayToMap(
		state.balls.map((b) => b.target).filter((v) => v > -1 && typeof v === 'number')
	);
</script>

<div class="game">
	{#if $activeView === 'game'}
		{#key state}
			<Game {state} bind:steps={gameSteps} bind:won={gameWon} />
		{/key}
	{:else if $activeView === 'map'}
		<Grid bind:state {balls} {targets} {showIndex} />
	{/if}
</div>

<Controls bind:state {gameSteps} {balls} {targets} />

<style>
	.game {
		grid-area: editor;
		display: grid;
		place-items: center;
	}
</style>
