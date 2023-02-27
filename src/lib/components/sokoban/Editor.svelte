<script lang="ts">
	import Tab from '$lib/components/tab';
	import localStore from '$lib/localStore';
	import { writable, type Writable } from 'svelte/store';
	import Icon from '../Icon.svelte';
	import { colors } from './constants';
	import type { BoardState } from './core';
	import Game from './Game.svelte';
	import { arrayToMap } from './utils';

	export let state: BoardState;

	const activeView: Writable<'map' | 'game'> = localStore('sokoban-editor-view', 'map');

	$: amount = state.width * state.height;
	let ballAmount = localStore('sokoban-editor-ball-amount', 1);
	let gameSteps = writable(0);

	$: if ($ballAmount > 0) {
		state.balls = state.balls.slice(0, $ballAmount);
	}

	$: if (state.cells.includes(undefined)) {
		state.cells = state.cells.map((v) => (Boolean(v) ? 1 : 0));
	}

	$: if (state.steps.best >= state.steps.worst - 1) {
		state.steps.worst = state.steps.best + 1;
	}

	$: balls = arrayToMap(state.balls.map((b) => b.start).filter((v) => typeof v === 'number'));
	$: targets = arrayToMap(state.balls.map((b) => b.target).filter((v) => typeof v === 'number'));
	$: console.log({ balls, targets });

	let _width = state.width;
	let _height = state.height;
	$: if (state.width * state.height !== state.cells.length) {
		const cells = new Array(state.width * state.height).fill(0).map((_, i) => {
			const nx = i % state.width;
			const ny = Math.floor(i / state.width);
			if (nx < _width && ny < _height) {
				const index = ny * _width + nx;
				return state.cells[index];
			}
			return 0;
		});
		state.cells = cells;
		_width = state.width;
		_height = state.height;
	}

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

			if (type === 'ball') {
				ball.start = index;
			} else {
				ball.target = index;
			}
			state.balls[targetIndex] = ball;
			console.log({ dragTarget, index, balls: state.balls });
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
				console.log('dragTarget', ball);
				if (!ball) return;
				if (dragTarget.type === 'ball') {
					ball.start = null;
				}
				if (dragTarget.type === 'target') {
					ball.target = null;
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
		{#if $activeView !== 'game'}
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
		{:else}
			<Game {state} bind:steps={gameSteps} />
		{/if}
		<div class="controls">
			<div class="controls-header">
				<Tab bind:value={$activeView}>
					<Tab.Content value="map"><Icon name="edit" /></Tab.Content>
					<Tab.Content value="game"><Icon name="player-play" /></Tab.Content>
				</Tab>
				{#if $activeView === 'game'}
					{$gameSteps}
				{/if}
			</div>
			<br />
			{#if $activeView === 'map'}
				<label for="height">Height</label>
				<input id="height" type="number" bind:value={state.height} min="2" max="20" step="1" />
				<br />
				<label for="width">Width</label>
				<input id="width" type="number" bind:value={state.width} min="2" max="20" step="1" />

				<br />
				<label for="balls">Balls</label>
				<input id="balls" type="number" bind:value={$ballAmount} min="1" max="4" step="1" />

				{#each Array.from({ length: $ballAmount }) as _, index}
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
			{/if}

			{#if $activeView === 'game'}
				<label for="difficulty">Difficulty</label>
				<br />
				<input
					id="difficulty"
					type="number"
					bind:value={state.difficulty}
					min="0"
					max="5"
					step="1"
				/>

				<br />
				<br />
				<label for="best-steps">Best Steps</label>
				<br />
				<input
					id="best-steps"
					type="number"
					bind:value={state.steps.best}
					step="1"
					min="0"
					max="50"
				/>
				<br />
				<br />
				<label for="worst-steps">Worst Steps</label>
				<br />
				<input
					id="worst-steps"
					type="number"
					bind:value={state.steps.worst}
					min="0"
					max="50"
					step="1"
				/>
			{/if}
		</div>
	</div>
</div>

<style>
	.wrapper {
		display: grid;
		justify-content: center;
		padding-top: 20vh;
		height: 100%;
	}
	.grid {
		grid-template-columns: repeat(var(--width), 1fr);
		grid-template-rows: repeat(var(--height), 1fr);
		width: min-content;
		height: min-content;
	}

	.view-balls .cell {
		border-color: transparent;
	}

	.controls-header {
		display: flex;
		gap: 10px;
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
	.controls {
		margin-top: 20px;
	}
</style>
