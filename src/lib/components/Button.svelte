<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function handleClick() {
		dispatch('click');
	}
</script>

<button on:click={handleClick}>
	<slot />
</button>

<style>
	button {
		padding: 0.6em 0.8em;
		display: flex;
		gap: 0.5em;
		align-items: center;
		border-radius: 10px;
		border: 1px solid var(--outline);
		background: var(--neutral800);
		color: var(--text);
		cursor: pointer;
	}
</style>
