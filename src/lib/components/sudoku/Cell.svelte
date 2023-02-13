<script lang="ts">
	import { getContext } from './context';

	export let index: number;
	export let value: number | null;
	export let initialValue: number | null = null;

	const ctx = getContext('grid');

	const activeIndex = ctx.activeIndex;
	const hoveredIndex = ctx.hoveredIndex;
	const hoveredValue = ctx.hoveredValue;

	const initial = initialValue !== null;

	const [row, col] = ctx.getPosition(index);
	const square = Math.floor(row / 3) * 3 + Math.floor(col / 3);

	$: [hoveredRow, hoveredCol] = ctx.getPosition($hoveredIndex);
	$: hoveredSquare = Math.floor(hoveredRow / 3) * 3 + Math.floor(hoveredCol / 3);

	const borderRight =
		col === 2 || col === 5 ? '1.5px solid var(--outline-strong)' : '1px solid var(--outline)';
	const borderBottom =
		row === 2 || row === 5 ? '1.5px solid var(--outline-strong)' : '1px solid var(--outline)';
</script>

<div
	class="cell-wrapper"
	on:mousedown={() => activeIndex.set(index)}
	on:mouseup={() => activeIndex.set(-1)}
	on:keydown={() => ctx.toggleActive(index)}
	on:mouseover={() => hoveredIndex.set(index)}
	on:focus={() => hoveredIndex.set(index)}
	on:mouseleave={() => $hoveredIndex === index && ctx.hoveredIndex.set(-1)}
	class:initial
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
		height: 40px;
		width: 40px;
		padding: 4px;
		margin: 0;
		box-sizing: border-box;
		display: grid;
		place-items: center;
		color: var(--text);
		transition: background 0.1s ease, color 0.1s ease, font-weight 0.2s ease;
	}

	.initial {
		color: #f5f5f588;
		/* font-weight: bold; */
	}

	.hovered {
		background: #f5f5f522;
		color: var(--text-strong);
	}
	.hovered-same {
		background: #f5f5f588;
	}
</style>
