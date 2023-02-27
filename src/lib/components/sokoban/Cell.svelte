<script lang="ts">
	import { getContext } from './context';
	import { colors } from './constants';

	export let visible: boolean;
	export let index: number;
	export let target: number = -1;

	const ctx = getContext('sokoban');

	const balls = ctx.balls;

	$: hasBall = $balls && target >= 0 && $balls[target] === index;

	const [cellX, cellY] = ctx.getPosition(index);

	const hasCellAbove = ctx.getCell(ctx.getIndex(cellX, cellY - 1));
	const hasCellBelow = ctx.getCell(ctx.getIndex(cellX, cellY + 1));
	const hasCellLeft = ctx.getCell(ctx.getIndex(cellX - 1, cellY));
	const hasCellRight = ctx.getCell(ctx.getIndex(cellX + 1, cellY));

	const borderR = '15px';
	const none = '0px';
	$: borderRadius = ` ${hasCellAbove || hasCellLeft ? none : borderR} 
        ${hasCellAbove || hasCellRight ? none : borderR} 
        ${hasCellRight || hasCellBelow ? none : borderR} 
        ${hasCellBelow || hasCellLeft ? none : borderR};`;
</script>

{#if visible}
	<div
		class="cell visible"
		class:hasBall
		class:target={target >= 0}
		style={` 
      --target-color: var(--${colors[target]}50);
      border-radius:  ${borderRadius}
      --border-radius: ${borderRadius};

      border-color: var(--outline);
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
		margin-top: -1px;
		margin-left: -1px;
	}

	.visible {
		border-width: 1px;
		border-style: solid;
		background: var(--cell-gradient);
		background-attachment: fixed;
		background-size: 100% 100%;
		background-position: center;
		box-shadow: 8px 8px 32px rgba(0, 0, 0, 0.25);
	}

	.visible::before {
		content: '';
		position: absolute;
		height: 100%;
		width: 100%;
		z-index: 99;
		background: url(/noise.png);
		background-size: 100px;
		opacity: 0.3;
		border-radius: var(--border-radius);
		background-attachment: fixed;
	}

	.target::after {
		content: '';
		box-sizing: border-box;
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		opacity: 0.2;
		transform: scale(0.6);
		border-color: var(--target-color);
		border: 6px solid var(--target-color);
		transition: transform 0.5s, opacity 0.5s, border-radius 0.3s, background 0.3s ease;
		transition-delay: 0.5s;
	}

	.hasBall::after {
		opacity: 0.3;
		transform: scale(1);
		background: var(--target-color);
		border-radius: var(--border-radius);
	}
</style>
