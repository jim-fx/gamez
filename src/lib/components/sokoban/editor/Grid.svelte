<script lang="ts">
	import { fade } from 'svelte/transition';
	import { colors } from '../constants';
	import type { BoardState } from '../core';
	import { activeView, dragTarget } from './stores';

	export let state: BoardState;
	export let targets: Map<number, number>;
	export let balls: Map<number, number>;

	export let showIndex = false;

	$: amount = state.width * state.height;

	function toggleActiveCell(index: number) {
		state.cells[index] = state.cells[index] === 1 ? 0 : 1;
	}

	function handleDrop(index: number) {
		if ($dragTarget) {
			const { type, index: targetIndex } = $dragTarget;

			if (targets.has(index) || balls.has(index)) {
				console.log('target already occupied');
				return;
			}

			if (state.cells[index] !== 1) {
				return;
			}

			let ball = state.balls[targetIndex] || {};

			console.log('handleDrop', { index, ball, dragTarget });

			if (type === 'ball') {
				ball.start = index;
			} else {
				ball.target = index;
			}
			state.balls[targetIndex] = ball;
			$dragTarget = null;
		}
	}

	function getColorForCell(
		index: number,
		_balls: Map<number, number>,
		_targets: Map<number, number>
	) {
		let color;
		const b = balls.has(index) ? balls.get(index) : -1;
		if (b !== undefined && b > -1) {
			color = colors[b];
		}
		const t = targets.has(index) ? targets.get(index) : -1;
		if (t !== undefined && t > -1) {
			color = colors[t];
		}
		if (color) {
			return `var(--${color}50)`;
		} else {
			return 'transparent';
		}
	}

	function handleBodyDrop() {
		setTimeout(() => {
			if ($dragTarget) {
				const ball = state.balls[$dragTarget.index];
				console.log('handleBodyDrop', ball);
				if (!ball) return;
				if ($dragTarget.type === 'ball') {
					ball.start = -1;
				}
				if ($dragTarget.type === 'target') {
					ball.target = -1;
				}
				if (ball.start === null && ball.target === null) {
					state.balls.splice($dragTarget.index, 1);
				}
				state.balls = [...state.balls];
			}
		}, 10);
	}

	function handleDragOver(ev: DragEvent) {
		ev.preventDefault();
		if (ev.dataTransfer) {
			ev.dataTransfer.dropEffect = 'move';
		}
	}

	function setDragTarget(target: 'ball' | 'target', index: number | undefined) {
		if (index === undefined) return;
		$dragTarget = {
			type: target,
			index
		};
	}

	$: console.log('grid', { targets, balls });
</script>

<svelte:body on:dragover={handleDragOver} on:drop={handleBodyDrop} />
<div class="wrapper" class:hidden={$activeView !== 'map'} out:fade|global={{ duration: 300 }}>
	<div
		class="grid"
		class:visible={$activeView === 'map'}
		style={`--width: ${state.width}; --height: ${state.height}`}
	>
		{#each Array.from({ length: amount }) as _, index}
			<div
				class="cell"
				class:active={state.cells[index] === 1}
				style={`--color: ${getColorForCell(index, balls, targets)}`}
				on:dragover={handleDragOver}
				on:drop={() => handleDrop(index)}
				on:keydown={() => {}}
				on:click={() => $activeView === 'map' && toggleActiveCell(index)}
			>
				{#if showIndex}
					<span class="index">{index}</span>
				{/if}
				{#if balls.has(index)}
					<div
						class="ball"
						draggable="true"
						on:dragstart={() => setDragTarget('ball', balls.get(index))}
					/>
				{/if}
				{#if targets.has(index)}
					<div
						class="target"
						draggable="true"
						on:dragstart={() => setDragTarget('target', targets.get(index))}
					/>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.wrapper {
		position: relative;
		width: fit-content;
		z-index: 100;
	}
	.wrapper.hidden {
		position: absolute;
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
	}
	.index {
		font-size: 12px;
		color: var(--neutral200);
		position: absolute;
		top: 5px;
		right: 5px;
	}

	.ball {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: var(--color);
	}

	.target {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		border: 2px solid var(--color);
	}

	.grid {
		grid-template-columns: repeat(var(--width), 1fr);
		grid-template-rows: repeat(var(--height), 1fr);
		width: min-content;
		height: min-content;
		position: absolute;
		transition: opacity 0.2s;
		pointer-events: none;
	}

	.grid.visible {
		margin: 0 auto;
		position: relative;
		opacity: 1;
		transition: opacity 0s;
		pointer-events: auto;
	}

	.cell {
		position: relative;
		box-sizing: border-box;
		margin-left: -1px;
		margin-top: -1px;
		border: 1px solid var(--neutral100);
		width: 60px;
		height: 60px;
		display: grid;
		place-items: center;
	}
	.cell.active {
		background-color: var(--neutral800);
	}
</style>
