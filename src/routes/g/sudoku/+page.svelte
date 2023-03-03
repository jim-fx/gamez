<script lang="ts">
	import { Sudoku } from '$lib/components';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { calculateTip } from '$lib/components/sudoku';
	import { formatTimeSpan } from '$lib/utils';
	import { fade } from 'svelte/transition';
	import Controls from './Controls.svelte';
	import Settings from './Settings.svelte';
	import Statistics from './Statistics.svelte';
	import { createNewGame, view } from './stores';

	import { currentGame, custom } from './stores';

	let won = false;

	let tips: number[] = [];

	function getTip() {
		tips = calculateTip($currentGame.initial, $custom);
	}

	$: if (won && !$currentGame.endAt) {
		$currentGame.endAt = new Date();
	}
</script>

<svelte:head>
	<title>Gamez | Sudoku</title>
</svelte:head>

<div class="outer-wrapper">
	<div class="help" class:visible={$view === 'game' && !won}>
		<Button on:click={getTip} style={'background: none; border: none; padding: 0.1em;'}>
			<Icon size="small" name="help" />
			tip
		</Button>
	</div>
	<div class="wrapper">
		{#if $view === 'game'}
			{#if won}
				<div class="won" in:fade={{ delay: 1000 }}>
					<div>
						<h3>solved!</h3>
						{#if $currentGame.endAt}
							<p>
								{formatTimeSpan($currentGame.endAt.getTime() - $currentGame.startedAt.getTime())}
							</p>
						{/if}
						<Button on:click={createNewGame}>new game</Button>
					</div>
				</div>
			{/if}
			{#key $currentGame}
				<Sudoku grid={$currentGame.initial} bind:custom={$custom} bind:won />
			{/key}
		{:else if $view === 'settings'}
			<Settings />
		{:else if $view === 'statistics'}
			<Statistics />
		{/if}
	</div>
</div>

<Controls />

<style>
	.outer-wrapper {
		position: relative;
	}

	.help {
		position: absolute;
		left: 0.5em;
		z-index: -1;
		padding: 10px;
		opacity: 0;
		transition: bottom 0.3s ease, opacity 0.1s ease;
		bottom: 1em;
	}

	.help.visible {
		bottom: -2.5em;
		z-index: 5;
		opacity: 1;
	}

	.won {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 5;
		color: white;
		display: grid;
		place-items: center;
		backdrop-filter: blur(2px);
	}
	.won::before {
		content: '';
		opacity: 0.8;
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background: var(--neutral900);
		z-index: -1;
	}

	.won h3 {
		font-size: 3rem;
		font-weight: 100;
		margin: 0;
		padding: 0;
	}

	.won p {
		color: var(--text);
		margin: 0;
		padding: 0;
		margin-bottom: 20px;
	}

	.won > div {
		display: grid;
	}

	.wrapper {
		position: relative;
		border: 1px solid black;
		width: 360px;
		height: 360px;
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

	.wrapper::after {
		top: 0;
		left: 0;
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		background: url(/noise.png);
		background-size: 50%;
		pointer-events: none;
		opacity: 0.15;
	}

	:global(main) {
		display: grid;
		place-items: center;
		height: 100vh;
		width: 100vw;
	}
</style>
