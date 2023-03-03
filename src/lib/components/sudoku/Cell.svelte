<script lang="ts">
	import { getContext } from './context';

	export let index: number;
	export let value: number;
	export let initialValue: number = 0;
	export let error = false;

	const ctx = getContext('grid');

	const activeIndex = ctx.activeIndex;
	const hoveredIndex = ctx.hoveredIndex;
	const hoveredValue = ctx.hoveredValue;

	const initial = initialValue !== 0;

	const [row, col] = ctx.getPosition(index);
	const square = Math.floor(row / 3) * 3 + Math.floor(col / 3);

	$: [hoveredRow, hoveredCol] = ctx.getPosition($hoveredIndex);
	$: hoveredSquare = Math.floor(hoveredRow / 3) * 3 + Math.floor(hoveredCol / 3);

	const borderRight =
		col === 8
			? ''
			: col === 2 || col === 5
			? '1px solid var(--outline-strong)'
			: '1px solid var(--outline)';
	const borderBottom =
		row === 8
			? ''
			: row === 2 || row === 5
			? '1px solid var(--outline-strong)'
			: '1px solid var(--outline)';
</script>

<div
	class="cell-wrapper"
	on:mousedown={() => activeIndex.set(index)}
	on:mouseup={() => activeIndex.set(-1)}
	on:keydown={() => ctx.toggleActive(index)}
	on:mouseover={() => hoveredIndex.set(index)}
	on:focus={() => hoveredIndex.set(index)}
	class:error
	on:mouseleave={() => $hoveredIndex === index && ctx.hoveredIndex.set(-1)}
	class:own={!initial}
	class:active={$activeIndex === index}
	class:hovered-same={$hoveredValue === value}
	class:hovered={$hoveredIndex === index ||
		hoveredRow === row ||
		hoveredCol === col ||
		hoveredSquare === square}
	style="border-right: {borderRight}; border-bottom: {borderBottom};"
>
	{value || ''}
</div>

<style>
	.cell-wrapper {
		position: relative;
		height: 40px;
		width: 40px;
		padding: 4px;
		margin: 0;
		box-sizing: border-box;
		display: grid;
		place-items: center;
		color: var(--text);
		transition: background 0.1s ease, color 0.1s ease, font-weight 0.4s ease;
		color: var(--text);
	}

	.cell-wrapper::after {
		border-radius: 50%;
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		transition: transform 0.3s ease, opacity 0.3s ease, border-radius 0.4s ease;
		opacity: 0;
		transform: scale(0.4);
		background: var(--red50);
	}

	.error::after {
		border-radius: 0%;
		opacity: 0.2;
		transform: scale(1);
	}

	.own {
		color: var(--indigo50);
		text-shadow: 0 0 10px var(--indigo50);
	}

	.hovered {
		background: var(--neutral600);
		color: var(--text-strong);
	}
	.hovered-same {
		background: var(--neutral300);
		color: var(--neutral10);
	}
</style>
