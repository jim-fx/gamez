<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Tab from '$lib/components/tab';
	import type { BoardState } from '../core';
	import { activeView, dragTarget } from './stores';
	import { trimBoardState } from './utils';
	import { LL } from '$i18n/i18n-svelte';
	import { InputNumber } from '$lib/components/inputs';
	import { colors } from '../constants';

	export let state: BoardState;
	export let gameSteps: number;

	export let targets: Map<number, number>;
	export let balls: Map<number, number>;

	$: if (state.steps.best >= state.steps.worst - 1) {
		state.steps.worst = state.steps.best + 1;
	}

	function setBallAmount(value: number) {
		state.balls = state.balls.slice(0, value);
		if (value > state.balls.length) {
			state.balls = state.balls.concat(
				Array.from({ length: value - state.balls.length }).map(() => ({ start: -1, target: -1 }))
			);
		}
	}

	function setDragTarget(target: 'ball' | 'target', index: number | undefined) {
		if (index === undefined) return;
		$dragTarget = {
			type: target,
			index
		};
	}

	$: ballAmount = state.balls.length;
</script>

<div class="controls">
	<div class="outer-ball-wrapper" class:visible={$activeView === 'map'}>
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

	<div class="controls-header">
		<Tab bind:value={$activeView} showActiveState contentStyle={'padding: 0.7em'}>
			<Tab.Content value="map"><Icon size="small" name="edit" /></Tab.Content>
			<Tab.Content value="game"><Icon size="small" name="player-play" /></Tab.Content>
		</Tab>
		{#if $activeView === 'game'}
			<p class="steps">
				{$LL.steps()}: {gameSteps}
			</p>
		{/if}
		{#if $activeView === 'map'}
			<Button on:click={() => (state = trimBoardState(state))}>trim</Button>
		{/if}
	</div>
	<div class="controls-content">
		<table>
			{#if $activeView === 'map'}
				<tr>
					<td>
						<label for="sudoku-height">Height</label>
					</td>
					<td>
						<InputNumber id="sudoku-height" bind:value={state.height} min={2} max={20} />
					</td>
				</tr>
				<tr>
					<td><label for="sudoku-width">Width</label></td>
					<td>
						<InputNumber id="sudoku-width" bind:value={state.width} min={2} max={20} />
					</td>
				</tr>
				<tr>
					<td>
						<label for="sudoku-balls">Balls</label>
					</td>
					<td>
						<InputNumber
							id="sudoku-balls"
							on:change={(ev) => setBallAmount(ev.detail)}
							value={state.balls.length}
							min={1}
							max={4}
						/>
					</td>
				</tr>
			{/if}

			{#if $activeView === 'game'}
				<tr>
					<td>
						<label for="sudoko-best-steps">Best Steps</label>
					</td>
					<td>
						<InputNumber id="sudoko-best-steps" bind:value={state.steps.best} min={0} max={50} />
					</td>
				</tr>
				<tr>
					<td><label for="sudoku-worst-steps">Worst Steps</label></td>

					<td>
						<InputNumber id="sudoko-worst-steps" bind:value={state.steps.worst} min={0} max={50} />
					</td>
				</tr>
			{/if}
		</table>
	</div>
</div>

<style>
	.steps {
		color: var(--text);
		padding: 0;
		margin: auto 0;
		margin-left: 10px;
	}

	.controls-header {
		display: flex;
		gap: 10px;
		padding: 15px;
		border-bottom: 1px solid var(--outline);
	}

	table {
		padding: 15px;
		width: 100%;
		border-collapse: collapse;
	}

	tr {
		border-bottom: 1px solid var(--outline);
	}

	td:first-child {
		display: block;
		margin: 20px 0px;
		margin-left: 20px;
	}

	label {
		color: var(--text);
		margin: 10px 0px;
	}

	.controls {
		grid-area: controls;
		margin-right: auto;
		margin-left: auto;
		margin-top: 20px;
		width: calc(100% - 40px);
		max-width: 500px;
		min-height: calc(100% - 20px);
		background: var(--gradient);
		border-radius: 20px 20px 0px 0px;
		border: 1px solid var(--outline);
		border-bottom: none;
		box-sizing: border-box;
	}

	.outer-ball-wrapper {
		width: fit-content;
		margin: 0 auto;
		margin-top: -57px;
		position: relative;
		border: 1px solid var(--outline);
		background: var(--neutral800);
		display: flex;
		transform: translateY(60px);
		transition: transform 0.5s ease, opacity 0.3s ease;
		z-index: -1;
		opacity: 0;
	}

	.outer-ball-wrapper.visible {
		z-index: 1;
		opacity: 1;
		transition: transform 0.5s ease, opacity 0.3s ease, z-index 0.3s 0.6s;
		transform: translateY(0px);
	}

	.ball-wrapper {
		padding: 5px;
	}

	.ball {
		width: 20px;
		height: 20px;
		margin-bottom: 5px;
		border-radius: 50%;
		background: var(--color);
	}

	.target {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		box-sizing: border-box;
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
</style>
