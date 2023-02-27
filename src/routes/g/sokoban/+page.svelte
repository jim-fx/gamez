<script lang="ts">
	import Sokoban, { decodeSokobanBoard } from '$lib/components/sokoban';
	import localStore from '$lib/localStore';
	let won = false;

	const levels = [
		'EwZgnADAbFEBwBYIJARlQVma42fyA',
		'EwZgnADAbFEOwEYESckJgOBYAWArAiCgvjkicgkA',
		'CwUwrgTAbFAMDsBWWBGAHLAzJiKK2nhU1RWQmFQE5Ug'
	];
	const currentLevel = localStore('sokoban-current-level', 0);
	$: level = decodeSokobanBoard(levels[$currentLevel]);
</script>

<div>
	<Sokoban showRating bind:won state={level} />
	{#if won}
		<button on:click={() => $currentLevel++}>next</button>
	{/if}
</div>

<style>
	:global(body) {
		display: grid;
		place-items: center;
		height: 100vh;
		width: 100vw;
	}
</style>
