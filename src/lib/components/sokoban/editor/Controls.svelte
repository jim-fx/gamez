<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Tab from '$lib/components/tab';
	import type { BoardState } from '../core';
	import { activeView } from './stores';
	import { trimBoardState } from './utils';
	import { LL } from '$i18n/i18n-svelte';
	import { InputNumber } from '$lib/components/inputs';

	export let state: BoardState;
	export let gameSteps: number;

	$: if (state.steps.best >= state.steps.worst - 1) {
		state.steps.worst = state.steps.best + 1;
	}

	function setBallAmount(value: number) {
		console.log({ value });
	}
</script>

<div class="controls">
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
	<br />
	{#if $activeView === 'map'}
		<InputNumber label="Height" id="sudoku-height" bind:value={state.height} min={2} max={20} />
		<br />
		<InputNumber label="Width" id="sudoku-width" bind:value={state.width} min={2} max={20} />
		<br />
		<InputNumber
			label="Balls"
			id="sudoku-balls"
			on:change={(ev) => setBallAmount(ev.detail)}
			value={state.balls.length}
			min={1}
			max={4}
		/>
	{/if}

	{#if $activeView === 'game'}
		<InputNumber
			label="Best Steps"
			id="sudoko-best-steps"
			bind:value={state.steps.best}
			min={0}
			max={50}
		/>

		<br />
		<InputNumber
			label="Worst Steps"
			id="sudoko-worst-steps"
			bind:value={state.steps.worst}
			min={0}
			max={50}
		/>
	{/if}
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
	}

	.controls {
		margin-top: 20px;
	}
</style>
