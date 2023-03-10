<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '$lib/components/Icon.svelte';
	import { Preview } from '$lib/components/sokoban';
	import Stars from '$lib/components/star/Stars.svelte';
	import Tab from '$lib/components/tab';
	import { createEventDispatcher } from 'svelte';
	import levels from './levels';
	import { currentLevel, savedGames } from './stores';

	export let expanded = false;

	export let undoPossible = false;
	export let redoPossible = false;
	export let showHistoryArrow: 'undo' | 'redo' | null = null;

	$: maxLevel = Object.keys($savedGames).length;

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

	const dispatch = createEventDispatcher();
</script>

<div class="controls" class:show-levels={expanded}>
	<div class="controls-header">
		<Tab
			contentStyle={`padding: 0.8em;`}
			style={`
        border: none; 
        border-radius: 0px; 
        max-width: ${expanded ? '300px' : '100%'}; 
        width: 100%;
        justify-content: space-between;
      `}
		>
			<Tab.Content
				disabled={!expanded && !undoPossible}
				on:mouseover={() => (showHistoryArrow = 'undo')}
				on:focus={() => (showHistoryArrow = 'undo')}
				on:mouseleave={() => (showHistoryArrow = null)}
				on:click={() => {
					dispatch('undo');
					expanded = false;
				}}
			>
				<Icon name="arrow-left" size="small" />
			</Tab.Content>

			<div class="tab" class:visible={!expanded}>
				<Tab.Content on:click={() => (expanded = !expanded)}>
					<Icon name="menu-2" size="small" />
				</Tab.Content>
			</div>

			<Tab.Content
				disabled={!expanded && !redoPossible}
				on:click={() => (expanded ? goto('/g/sokoban/editor') : dispatch('redo'))}
				on:mouseover={() => (showHistoryArrow = 'redo')}
				on:focus={() => (showHistoryArrow = 'redo')}
				on:mouseleave={() => (showHistoryArrow = null)}
			>
				<Icon name={expanded ? 'edit' : 'arrow-right'} size="small" />
			</Tab.Content>
		</Tab>
	</div>
	<div class="controls-difficulty" />
	{#if expanded}
		<div class="scroll-wrapper">
			<table class="controls-level-wrapper">
				{#each levels as level, i}
					<tr
						class="controls-level"
						on:click={() => {
							$currentLevel = i;
							expanded = false;
						}}
						on:keydown={(e) => {
							if (e.key === 'Enter') {
								$currentLevel = i;
								expanded = false;
							}
						}}
						class:active={$currentLevel === i}
						class:locked={maxLevel < i}
					>
						<td>
							{#if maxLevel < i}
								<div class="lock">
									<Icon name="lock" size="medium" />
								</div>
							{/if}
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
	{/if}
</div>

<style>
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
		border-collapse: collapse;
	}

	.scroll-wrapper {
		overflow-y: auto;
		max-height: 100%;
		width: 300px;
		display: inherit;
		overflow-y: auto;
	}

	.controls-level {
		cursor: pointer;
		height: 80px;
		border-bottom: 1px solid var(--outline);
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
