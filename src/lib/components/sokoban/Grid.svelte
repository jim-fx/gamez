<script lang="ts">
	import Cell from './Cell.svelte';
	import BallComponent from './Ball.svelte';
	import { arrayToMap } from './utils';
	export let width: number = 5;
	export let height: number = 5;
	export let cells: number[];
	export let balls: number[];
	export let targets: number[];

	const _targets = arrayToMap(targets);
</script>

{#each balls as ball, i}
	<BallComponent index={i} position={ball} target={targets[i]} />
{/each}
<div
	class="grid-wrapper"
	style={`grid-template-columns: repeat(${width}, 1fr); grid-template-rows: repeat(${height}, 1fr);`}
>
	{#each cells as cell, i}
		<Cell visible={cell === 1} index={i} target={_targets.get(i)} />
	{/each}
</div>

<style>
	.grid-wrapper {
		display: grid;
		grid-gap: 0;
		width: fit-content;
	}
</style>
