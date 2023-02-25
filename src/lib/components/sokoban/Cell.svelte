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

	const borderLarge = 'var(--outline-strong)';
	const borderSmall = 'var(--outline)';
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

      border-color: 
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
		background-color: var(--light);
		border: solid 0.5px white;
		/* box-shadow: 8px 8px 32px rgba(0, 0, 0, 0.25), 4px 4px 8px rgba(0, 0, 0, 0.2), */
		/* 	inset 2px 2px 9px rgba(255, 255, 255, 0.05), inset -2px -2px 9px rgba(0, 0, 0, 0.2); */
	}

	.visible::before {
		content: '';
		position: absolute;
		height: 100%;
		width: 100%;
		background: url(#noise);
	}

	.target::after {
		content: '';
		box-sizing: border-box;
		position: absolute;
		width: 100%;
		height: 100%;
		opacity: 0.3;
		background: var(--target-color);
		transition: transform 0.5s, opacity 0.5s, border-radius 0.3s;
		transition-delay: 0.5s;
		border-radius: 2px;
		transform: scale(1);
	}

	.hasBall::after {
		opacity: 0.5;
		transform: scale(0.7);
		border-radius: 50%;
	}
</style>
