<script lang="ts">
	import Sokoban, { decodeSokobanBoard } from '$lib/components/sokoban';
	import Controls from './Controls.svelte';
	import levels from './levels';
	import { currentLevel, savedGames } from './stores';
	import Won from './Won.svelte';
	let won = false;

	$: levelString = levels[$currentLevel];

	let undoPossible = false;
	let redoPossible = false;
	let undo: () => void;
	let redo: () => void;

	let showHistoryArrow: 'undo' | 'redo' | null = null;

	let rating = 0;
	let steps = 0;
	$: level = decodeSokobanBoard(levelString);
	$: if ($currentLevel > -1) {
		won = false;
		rating = 0;
	}

	$: if (won) {
		const saveGame = $savedGames[levelString];
		if ((!saveGame || saveGame.rating < rating) && rating > 0) {
			$savedGames[levelString] = {
				rating,
				createdAt: Date.now()
			};
		}
	}
	let showLevels = false;

	function nextLevel() {
		$currentLevel = Math.min($currentLevel + 1, levels.length - 1);
	}

	function previousLevel() {
		$currentLevel = Math.max($currentLevel - 1, 0);
	}

	function handleRestart() {
		won = false;
		level = decodeSokobanBoard(levelString);
	}
</script>

<svelte:head>
	<title>Gamez | Sokoban</title>
</svelte:head>
<h1>Level {$currentLevel + 1}</h1>
<div class="game-wrapper" class:visible={!showLevels}>
	{#if won}
		<Won {rating} {steps} on:restart={handleRestart} on:nextlevel={nextLevel} />
	{/if}
	{#key level}
		<Sokoban
			{showHistoryArrow}
			bind:undoPossible
			bind:redoPossible
			bind:undo
			bind:redo
			bind:won
			state={level}
			bind:rating
			bind:steps
			animate
		/>
	{/key}
</div>
<Controls
	bind:expanded={showLevels}
	{undoPossible}
	{redoPossible}
	on:undo={() => undo?.()}
	on:redo={() => redo?.()}
/>

<style>
	:global(main) {
		display: grid;
		place-items: center;
		grid-template-rows: 1fr 100px;
	}
	h1 {
		margin: 0;
		position: absolute;
		top: 10px;
		left: 10px;
		font-weight: lighter;
		color: var(--text);
	}

	.game-wrapper {
		position: relative;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s ease;
	}

	.game-wrapper.visible {
		opacity: 1;
		pointer-events: auto;
	}
</style>
