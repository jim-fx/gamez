<script lang="ts">
	import { colors } from '../constants';
	import type { BoardState } from '../core';
	import Game from '../Game.svelte';
	import { arrayToMap } from '../utils';
	import Controls from './Controls.svelte';
	import { activeView } from './stores';

	export let state: BoardState;

	let showIndeces = false;

	$: amount = state.width * state.height;
	$: ballAmount = state.balls.length;

	let gameSteps = 0;
	let gameWon = false;

	$: if (state.cells.length) {
		state.balls = state.balls.map((b) => {
			if (b.target >= state.width * state.height || state.cells[b.target] === 0) {
				b.target = -1;
			}
			if (b.start >= state.width * state.height || state.cells[b.start] === 0) {
				b.start = -1;
			}
			return b;
		});
	}

	$: if (gameSteps !== 0 && gameWon && state.steps.best > gameSteps) {
		state.steps.best = gameSteps;
	}

	$: balls = arrayToMap(
		state.balls.map((b) => b.start).filter((v) => v > -1 && typeof v === 'number')
	);
	$: targets = arrayToMap(
		state.balls.map((b) => b.target).filter((v) => v > -1 && typeof v === 'number')
	);

	function toggleActiveCell(index: number) {
		state.cells[index] = state.cells[index] === 1 ? 0 : 1;
	}

	let dragTarget: {
		type: 'ball' | 'target';
		index: number;
	} | null = null;

	function setDragTarget(target: 'ball' | 'target', index: number) {
		dragTarget = {
			type: target,
			index
		};
		console.log('setDragTarget', dragTarget);
	}

	function handleDragOver(ev: DragEvent) {
		ev.preventDefault();
		if (ev.dataTransfer) {
			ev.dataTransfer.dropEffect = 'move';
		}
	}

	function handleDrop(index: number) {
		if (dragTarget) {
			const { type, index: targetIndex } = dragTarget;

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
			dragTarget = null;
		}
	}

	function getColorForCell(
		index: number,
		_balls: Map<number, number>,
		_targets: Map<number, number>
	) {
		let color;
		if (balls.get(index) > -1) {
			color = colors[balls.get(index)];
		}
		if (targets.get(index) > -1) {
			color = colors[targets.get(index)];
		}
		if (color) {
			return `var(--${color}50)`;
		} else {
			return 'transparent';
		}
	}

	function handleBodyDrop() {
		setTimeout(() => {
			if (dragTarget) {
				const ball = state.balls[dragTarget.index];
				console.log('handleBodyDrop', ball);
				if (!ball) return;
				if (dragTarget.type === 'ball') {
					ball.start = -1;
				}
				if (dragTarget.type === 'target') {
					ball.target = -1;
				}
				if (ball.start === null && ball.target === null) {
					state.balls.splice(dragTarget.index, 1);
				}
				state.balls = [...state.balls];
			}
		}, 10);
	}
</script>

<svelte:body on:dragover={handleDragOver} on:drop={handleBodyDrop} />

<div class="wrapper" class:view-map={$activeView === 'map'} style="">
	<div>
		{#if $activeView === 'map'}
			<div class="outer-ball-wrapper">
				{#each Array.from({ length: ballAmount }) as _, index}
					<div class="ball-wrapper">
						<div
							class="ball"
							draggable="true"
							class:visible={![...balls.values()].includes(index)}
							on:dragstart={() => setDragTarget('ball', index)}
							style={`--color: var(--${colors[index]}50)`}
						/>
						<div
							class="target"
							draggable="true"
							class:visible={![...targets.values()].includes(index)}
							on:dragstart={() => setDragTarget('target', index)}
							style={`--color: var(--${colors[index]}50)`}
						/>
					</div>
				{/each}
			</div>
		{/if}
		<div class="grid" style={`--width: ${state.width}; --height: ${state.height}`}>
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
		{#if $activeView === 'game'}
			<Game {state} bind:steps={gameSteps} bind:won={gameWon} />
		{/if}
		<Controls bind:state {gameSteps} />
	</div>
</div>

<style>
	.wrapper {
		position: relative;
		display: grid;
		justify-content: center;
		width: fit-content;
	}
	.grid {
		grid-template-columns: repeat(var(--width), 1fr);
		grid-template-rows: repeat(var(--height), 1fr);
		width: min-content;
		height: min-content;
		position: absolute;
		opacity: 0;
		transition: opacity 0.2s;
		pointer-events: none;
	}

	.view-map .grid {
		position: relative;
		opacity: 1;
		transition: opacity 0s;
		pointer-events: auto;
	}

	.outer-ball-wrapper {
		position: absolute;
		right: -110px;
		border: 1px solid var(--outline);
		padding: 5px;
		box-sizing: border-box;
		top: -1px;
		background: var(--neutral800);
	}
	.ball-wrapper {
		padding: 5px;
		display: flex;
		gap: 10px;
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

	.ball-wrapper .target,
	.ball-wrapper .ball {
		opacity: 0.3;
		pointer-events: none;
	}

	.ball-wrapper .target.visible,
	.ball-wrapper .ball.visible {
		opacity: 1;
		pointer-events: all;
	}

	.cell {
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
