<script lang="ts">
	import { formatTimeSpan } from '$lib/utils';
	import Header from './Header.svelte';
	import { games } from './stores';
</script>

<Header name="statistics" />

{#each $games as game, i}
	<p>Game {i + 1}</p>
	<p>{game?.endAt ? formatTimeSpan(game.endAt.getTime() - game.startedAt.getTime()) : ''}</p>
	<p>{game.difficulty}</p>
	<hr />
{/each}
