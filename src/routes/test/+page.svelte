<script lang="ts">
	import historyStore from '$lib/historyStore';
	import { writable } from 'svelte/store';

	const store = historyStore('Test');
	const index = store.activeIndex;

	const history = writable<string[]>([]);

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'u') {
			store.undo();
			return;
		}
		if (e.key === 'r') {
			store.redo();
			return;
		}
		store.update((s) => s + e.key);
		$history = store.history as string[];
	}
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="wrapper">
	<p class="content">{$store}</p>
	<b>{$index}</b>

	{#each $history as h, i}
		<p class:active={i === $index}>{h}</p>
	{/each}
</div>

<style>
	.wrapper {
		width: 400px;
		margin: 0 auto;
		padding-top: 50px;
	}
	.content {
		font-size: 1.2em;
		font-weight: bold;
		background: #eee;
		border-radius: 5px;
		padding: 10px;
	}
	.active {
		border-left: solid thin red;
	}
</style>
