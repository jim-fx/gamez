<script lang="ts">
	import Sokoban from '$lib/components/sokoban';
	let won = false;
</script>

<div>
	{#if won}
		<h1>Won!</h1>
	{/if}
	<Sokoban bind:won />
</div>

<style>
	:global(body) {
		display: grid;
		place-items: center;
		height: 100vh;
		width: 100vw;
	}
</style>
