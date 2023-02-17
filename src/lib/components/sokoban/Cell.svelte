<script lang="ts">
	import { getContext } from './context';
	import { colors } from './constants';

	export let value: boolean;
	export let index: number;
	export let target: number = -1;

	const ctx = getContext('sokoban');

	const balls = ctx.balls;

	$: hasBall = target >= 0 && $balls[target] === index;

	const [cellX, cellY] = ctx.getPosition(index);

	const hasCellAbove = ctx.getCell(ctx.getIndex(cellX, cellY - 1));
	const hasCellBelow = ctx.getCell(ctx.getIndex(cellX, cellY + 1));
	const hasCellLeft = ctx.getCell(ctx.getIndex(cellX - 1, cellY));
	const hasCellRight = ctx.getCell(ctx.getIndex(cellX + 1, cellY));

	const borderR = '10px';
	const none = '0px';

	const borderLarge = '1px';
	const borderSmall = '0.5px';
</script>

{#if value}
	<div
		class="cell visible"
		class:hasBall
		class:target={target >= 0}
		style={` 
      --target-color: ${colors[target]};
      border-radius: 
        ${hasCellAbove || hasCellLeft ? none : borderR} 
        ${hasCellAbove || hasCellRight ? none : borderR} 
        ${hasCellRight || hasCellBelow ? none : borderR} 
        ${hasCellBelow || hasCellLeft ? none : borderR};

      border-width: 
        ${hasCellAbove ? borderSmall : borderLarge} 
        ${hasCellRight ? borderSmall : borderLarge} 
        ${hasCellBelow ? borderSmall : borderLarge} 
        ${hasCellLeft ? borderSmall : borderLarge};
    `}
	/>
{:else}
	<div class="cell" />
{/if}

<style>
	.cell {
		color: white;
		position: relative;
		outline: solid thin transparent;
		height: var(--cell-size);
		width: var(--cell-size);
		box-sizing: border-box;
		pointer-events: none;
		user-select: none;
		/* border: solid thin white; */
	}

	.visible {
		border: solid 0.5px white;
		background-color: #000;
	}

	.target::after {
		content: '';
		box-sizing: border-box;
		position: absolute;
		width: 50%;
		height: 50%;
		top: 25%;
		left: 25%;
		border-radius: 100%;
		opacity: 0.5;
		border: solid 3px var(--target-color);
		transform: scale(1);
		transition: transform 0.5s, opacity 0.5s;
		transition-delay: 0.5s;
	}

	.hasBall::after {
		transform: scale(1.5);
		opacity: 1;
	}
</style>
