<script lang="ts">
	import Sokoban from '$lib/components/sokoban';
</script>

<Sokoban targets={[10, 11]} width={5} height={5} balls={[6, 5]} />

<style>
	:global(body) {
		display: grid;
		place-items: center;
		height: 100vh;
		width: 100vw;
	}
</style>
