<script lang="ts">
	import Sokoban from '$lib/components/sokoban';
	let won = false;
</script>

<div>
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
