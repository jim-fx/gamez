<script lang="ts">
	import { onMount } from 'svelte';
	import { getContext } from './context';

	export let value: string | undefined = undefined;

	const ctx = getContext();
	const activeIndex = ctx.activeTab;
	let index = ctx.registerTab(value);

	onMount(() => {
		return () => {
			ctx.unregisterTab($index);
		};
	});
</script>

<div
	class="wrapper"
	on:click={() => ctx.setActiveTab($index)}
	class:active={$index === $activeIndex}
>
	<slot />
</div>

<style>
	.wrapper {
		padding: 0.5em;
		width: fit-content;
		border-right: solid 1px var(--neutral100);
		transition: background-color 0.1s ease-in-out;
		cursor: pointer;
	}

	.active {
		background-color: var(--neutral100);
		color: var(--neutral800);
	}
</style>
