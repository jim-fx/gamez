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
		position: relative;
		padding: 0.8em 1em;
		display: flex;
		gap: 0.5em;
		align-items: center;
		border-radius: 20px;
		width: fit-content;
		border: 1px solid var(--outline);
		background: var(--neutral800);
		color: var(--text);
		cursor: pointer;
	}

	button::after {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0px;
		right: 0px;
		border-radius: 20px;
		background: url(/noise.png);
		background-size: 100%;
		opacity: 0.4;
	}
</style>
