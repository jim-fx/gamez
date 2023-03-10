<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from '../Icon.svelte';
	import Tab from '../tab';

	export let value = 1;
	export let min = 0;
	export let max = 10;
	export let id: string;
	export let label: string | undefined = undefined;

	const dispatch = createEventDispatcher();

	function increment() {
		value = Math.min(value + 1, max);
	}

	function decrement() {
		value = Math.max(value - 1, min);
	}

	let oldValue = value;
	$: if (oldValue !== value) {
		dispatch('change', value);
		if (oldValue < value) {
			dispatch('increment');
		} else {
			dispatch('decrement');
		}
		oldValue = value;
	}
</script>

{#if label}
	<label for={id}>
		{label}
	</label>
{/if}

<Tab noise>
	<Tab.Content on:click={decrement}>
		<Icon name="minus" size="small" />
	</Tab.Content>
	<Tab.Content>
		<input
			{id}
			style="width: {value.toString().length + 1}ch"
			type="number"
			{min}
			{max}
			bind:value
		/>
	</Tab.Content>
	<Tab.Content on:click={increment}>
		<Icon name="plus" size="small" />
	</Tab.Content>
</Tab>

<style>
	input {
		background: none;
		border: none;
		width: fit-content;
		text-align: center;
		color: var(--text);
		font-family: 'Nunito', sans-serif;
		font-size: 1.2rem;
	}

	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
		appearance: textfield;
	}

	label {
		color: var(--text);
	}
</style>
