<script lang="ts">
	import { Sudoku } from '$lib/components';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import NoiseWrapper from '$lib/components/NoiseWrapper.svelte';
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
		tips.forEach((tip, i) => {
			if (tip) {
				$custom[i] = tip;
			}
		});
	}

	$: if (won && !$currentGame.endAt) {
		$currentGame.endAt = new Date();
		console.log('Set endAT', $currentGame);
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
		<Button on:click={createNewGame} style={'background: none; border: none; padding: 0.1em;'}>
			<Icon size="small" name="help" />
			new game
		</Button>
	</div>
	<NoiseWrapper noise style="min-width: 300px;">
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
	</NoiseWrapper>
</div>

<Controls />

<style>
	.outer-wrapper {
		position: relative;
	}

	.help {
		position: absolute;
		display: flex;
		gap: 20px;
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
		opacity: 0.5;
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

	:global(main) {
		display: grid;
		place-items: center;
		height: 100vh;
		width: 100vw;
	}
</style>
