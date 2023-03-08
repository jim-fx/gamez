<script lang="ts">
	import { formatTimeSpan } from '$lib/utils';
	import Header from './Header.svelte';
	import { games } from './stores';
</script>

<div class="outer-wrapper">
	<Header name="statistics" />

	<div class="wrapper">
		{#each $games as game, i}
			<p class="title">Game {i + 1}</p>
			<p class="time">
				{game?.endAt
					? formatTimeSpan(game.endAt.getTime() - game.startedAt.getTime(), 'simple')
					: ''}
			</p>
			<p class="difficulty">{game.difficulty}</p>
		{/each}
	</div>
</div>

<style>
	.outer-wrapper {
		display: grid;
		height: 100%;
		grid-template-rows: min-content 1fr;
	}
	.wrapper {
		overflow-y: auto;
		display: grid;
		grid-template-columns: max-content 1fr max-content;
		grid-template-rows: repeat(auto-fill, minmax(0px, max-content));
		align-items: center;
	}

	p {
		padding: 1em;
		padding-bottom: 0.5em;
		margin: 0;
		color: var(--text);
	}

	.title {
		font-weight: bold;
	}

	.time {
		font-size: 0.8em;
		font-weight: lighter;
	}

	.difficulty {
	}
</style>
