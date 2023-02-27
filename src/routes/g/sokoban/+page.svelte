<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import Sokoban, { decodeSokobanBoard, levels } from '$lib/components/sokoban';
	import Preview from '$lib/components/sokoban/Preview.svelte';
	import Stars from '$lib/components/star/Stars.svelte';
	import Tab from '$lib/components/tab';
	import localStore from '$lib/localStore';
	let won = false;

	const currentLevel = localStore('sokoban-current-level', 0);
	$: levelString = levels[$currentLevel];

	const savedGames = localStore<{ [hash: string]: { steps: number; createdAt: number } }>(
		'sokoban-saved-games',
		{}
	);

	$: maxLevel = Object.keys($savedGames).length;

	let steps = 0;
	$: level = decodeSokobanBoard(levelString);
	$: if ($currentLevel > -1) {
		won = false;
		steps = 0;
	}

	$: if (won) {
		const saveGame = $savedGames[levelString];
		if ((!saveGame || saveGame.steps > steps) && steps > 0) {
			console.log('SaveGame', { levelString, steps: steps });
			$savedGames[levelString] = {
				steps: steps,
				createdAt: Date.now()
			};
		}
	}
	let showLevels = false;

	function calculateLevelRating(level: string, levelIndex: number, _savedGames: typeof savedGames) {
		if (levelIndex > maxLevel) {
			return 0;
		}
		console.log({ level, save: $savedGames });

		if (level in $savedGames) {
			const { steps } = $savedGames[level];
			const l = decodeSokobanBoard(level);

			console.log({ level, steps, _steps: l.steps });

			const rating =
				5 - Math.min(Math.floor(((steps - l.steps.best) / (l.steps.worst - l.steps.best)) * 4), 4);
			return rating;
		}

		return 0;
	}
</script>

<div class="game-wrapper" class:visible={!showLevels}>
	<h1>Level {$currentLevel + 1}</h1>
	{#key level}
		<Sokoban showRating={won} bind:won state={level} bind:steps />
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
	<div class="controls-level-wrapper">
		{#each levels as level, i}
			<div
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
				<h3>Level {i + 1}</h3>
				<Stars rating={calculateLevelRating(level, i, savedGames)} size="small" />
				<Preview {level} />
			</div>
		{/each}
	</div>
</div>

<style>
	:global(body) {
		display: grid;
		place-items: center;
		grid-template-rows: 1fr 100px;
	}
	h1 {
		margin: 0;
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
	}

	.controls-level {
		position: relative;
		display: flex;
		cursor: pointer;
		overflow-y: scroll;
		justify-content: space-between;
		padding: 1.5em 1em;
		border-bottom: 1px solid var(--outline);
		align-items: center;
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
	}

	.game-wrapper {
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s ease;
	}

	.game-wrapper.visible {
		opacity: 1;
		pointer-events: auto;
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
		max-height: calc(100vh - 2rem);
		width: 300px;

		transition: max-height 0.3s 0.1s ease, width 0.3s ease;
	}
</style>
