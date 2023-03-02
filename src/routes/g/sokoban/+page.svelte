<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import Sokoban, { decodeSokobanBoard, levels } from '$lib/components/sokoban';
	import Preview from '$lib/components/sokoban/Preview.svelte';
	import Stars from '$lib/components/star/Stars.svelte';
	import Tab from '$lib/components/tab';
	import LL from '../../../i18n/i18n-svelte';
	import localStore from '$lib/localStore';
	import { scale, fade } from 'svelte/transition';
	import Button from '$lib/components/Button.svelte';
	let won = false;

	const currentLevel = localStore('sokoban-current-level', 0);
	$: levelString = levels[$currentLevel];

	const savedGames = localStore<{ [hash: string]: { rating: number; createdAt: number } }>(
		'sokoban-saved-games',
		{}
	);

	$: maxLevel = Object.keys($savedGames).length;

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

	function calculateLevelRating(level: string, levelIndex: number, _savedGames: typeof savedGames) {
		if (levelIndex > maxLevel) {
			return 0;
		}

		if (level in $savedGames) {
			const { rating } = $savedGames[level];
			return rating;
		}

		return 0;
	}

	function handleRestart() {
		won = false;
		level = decodeSokobanBoard(levelString);
	}
</script>

<h1>Level {$currentLevel + 1}</h1>
<div class="game-wrapper" class:visible={!showLevels}>
	{#if won}
		<div class="won" in:fade={{ delay: 1000 }} out:fade>
			<h2 in:scale={{ delay: 1500 }}>{$LL.rating[rating.toString()]()}</h2>
			<span in:scale={{ delay: 1750 }}>
				<Stars {rating} animate delay={1750} />
			</span>
			<p in:scale={{ delay: 1900 }}>{steps} {$LL.steps()}</p>
			{#if rating < 3}
				<span in:scale={{ delay: 2000 }}>
					<Button on:click={handleRestart}>
						<div class="i-tabler-reload" />
						{$LL.try_again()}
					</Button>
				</span>
			{/if}
		</div>
	{/if}
	{#key level}
		<Sokoban bind:won state={level} bind:rating bind:steps animate />
	{/key}
</div>
<div class="controls" class:show-levels={showLevels}>
	<div class="controls-header">
		<Tab
			contentStyle={`padding: 0.8em;`}
			style={`border: none; border-radius: 0px; max-width: ${
				showLevels ? '300px' : '100%'
			}; width: 100%;`}
		>
			<Tab.Content
				disabled={$currentLevel === 0 && !showLevels}
				on:click={() =>
					showLevels ? (showLevels = false) : ($currentLevel = Math.max($currentLevel - 1, 0))}
			>
				<Icon name="arrow-left" size="small" />
			</Tab.Content>

			<div class="tab" class:visible={!showLevels}>
				<Tab.Content on:click={() => (showLevels = !showLevels)}>
					<Icon name="menu-2" size="small" />
				</Tab.Content>
			</div>

			<div class="tab" class:visible={!showLevels}>
				<Tab.Content
					disabled={$currentLevel === levels.length - 1 || (!won && $currentLevel >= maxLevel)}
					on:click={() => ($currentLevel = Math.min($currentLevel + 1, levels.length - 1))}
				>
					<Icon name="arrow-right" size="small" />
				</Tab.Content>
			</div>
		</Tab>
	</div>
	<div class="controls-difficulty" />
	<table class="controls-level-wrapper">
		{#each levels as level, i}
			<tr
				class="controls-level"
				on:click={() => {
					$currentLevel = i;
					showLevels = false;
				}}
				on:keydown={(e) => {
					if (e.key === 'Enter') {
						$currentLevel = i;
						showLevels = false;
					}
				}}
				class:active={$currentLevel === i}
				class:locked={maxLevel < i}
			>
				{#if maxLevel < i}
					<div class="lock">
						<Icon name="lock" size="medium" />
					</div>
				{/if}
				<td>
					<h3>Level {i + 1}</h3>
				</td>
				<td>
					<Stars rating={calculateLevelRating(level, i, savedGames)} size="small" />
				</td>
				<td class="preview">
					<Preview {level} />
				</td>
			</tr>
		{/each}
	</table>
</div>

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
	.controls {
		display: grid;
		grid-template-rows: 45px 5px 1fr;
		max-height: 44px;
		max-width: 95vw;
		height: 100vh;
		position: absolute;
		width: 132px;
		bottom: 1rem;
		transition: max-height 0.3s ease, width 0.3s 0.1s ease;
		background: var(--gradient800);
		border-radius: 20px;
		z-index: 2;
		border: 1px solid var(--outline);
		overflow: hidden;
	}

	.controls-difficulty {
		background: var(--red100);
		border-bottom: 1px solid var(--outline);
	}

	.controls-level-wrapper {
		width: 300px;
		border-collapse: collapse;
	}

	.controls-level {
		position: relative;
		cursor: pointer;
		height: 80px;
		border-bottom: 1px solid var(--outline);
		align-items: center;
	}

	.preview > :global(.grid) {
		margin: 0 auto;
	}

	.controls-level.active {
		background: var(--neutral700);
	}

	.controls-level.locked {
		pointer-events: none;
	}

	.lock {
		position: absolute;
		left: 0;
		top: 0px;
		width: 100%;
		height: 100%;
		background: var(--gradient800);
		opacity: 0.9;
		color: var(--text);
		z-index: 1;
		cursor: default;
		pointer-events: none;
		display: grid;
		place-items: center;
	}

	h3 {
		width: fit-content;
		font-weight: thin;
		z-index: 5;
		color: var(--text);
		margin: 0;
		padding-left: 1em;
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

	.won {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		z-index: 20;
		background: var(--neutral900);
		width: 160%;
		height: 160%;
		margin-left: -30%;
		margin-top: -30%;
	}
	.won > p {
		color: var(--text);
	}

	.won > h2 {
		color: var(--neutral10);
		margin: 20px;
		font-size: 4rem;
		white-space: nowrap;
	}

	.tab {
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s ease;
	}

	.tab.visible {
		opacity: 1;
		pointer-events: auto;
	}

	.controls-header {
		border-bottom: 1px solid var(--outline);
	}

	.controls::before {
		content: '';
		position: absolute;
		height: 100%;
		width: 100%;
		z-index: 99;
		background: url(/noise.png);
		background-size: 100px;
		opacity: 0.3;
		background-attachment: fixed;
		pointer-events: none;
	}

	.controls.show-levels {
		max-height: 80vh;
		width: 300px;

		transition: max-height 0.3s 0.1s ease, width 0.3s ease;
	}
</style>
