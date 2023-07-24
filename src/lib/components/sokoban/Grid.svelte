<script lang="ts">
	import Cell from './Cell.svelte';
	import BallComponent from './Ball.svelte';
	import { arrayToMap } from './utils';
	import Arrow from './Arrow.svelte';
	import { scale } from 'svelte/transition';
	export let width: number = 5;
	export let height: number = 5;
	export let cells: number[];
	export let balls: number[];
	export let targets: number[];
	export let animate = false;

	export let arrow: { start: number; end: number; color: string } | null = null;

	const _targets = arrayToMap(targets);
</script>

{#each balls as ball, i}
	<BallComponent {animate} index={i} position={ball} target={targets[i]} />
{/each}
<div
	class="grid-wrapper"
	style={`
    grid-template-columns: repeat(${width}, 1fr); 
    grid-template-rows: repeat(${height}, 1fr);
    --cell-gradient: linear-gradient(120deg, var(--neutral800), var(--neutral850));
`}
>
	{#key arrow}
		{#if arrow}
			<Arrow {height} {width} start={arrow?.start} end={arrow?.end} color={arrow?.color} />
		{/if}
	{/key}
	{#each cells as cell, i}
		{#if animate}
			<span in:scale={{ delay: i * 20 }}>
				<Cell visible={cell === 1} index={i} target={_targets.get(i)} />
			</span>
		{:else}
			<Cell visible={cell === 1} index={i} target={_targets.get(i)} />
		{/if}
	{/each}
</div>

<style>
	.grid-wrapper {
		position: relative;
		display: grid;
		grid-gap: 0;
		width: fit-content;
	}
</style>
