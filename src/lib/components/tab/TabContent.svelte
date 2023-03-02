<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { getContext } from './context';

	export let value: string | undefined = undefined;
	export let disabled = false;

	const ctx = getContext();
	const activeIndex = ctx.activeTab;
	let index = ctx.registerTab(value);

	const dispatch = createEventDispatcher();

	function handleClick(e: MouseEvent) {
		ctx.setActiveTab($index);
		dispatch('click', e);
	}

	onMount(() => {
		return () => {
			ctx.unregisterTab($index);
		};
	});
</script>

<div
	class="tab-content-wrapper"
	class:disabled
	style={ctx.contentStyle}
	on:keydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			ctx.setActiveTab($index);
		}
	}}
	on:click={handleClick}
	class:active={$index === $activeIndex}
>
	<slot />
</div>

<style>
	.tab-content-wrapper {
		padding: 0.5em;
		width: fit-content;
		border-right: solid 1px var(--outline);
		transition: background-color 0.1s ease-in-out;
		cursor: pointer;
		position: relative;
		display: grid;
		place-items: center;
		transition: color 0.2s ease, background-color 0.2s ease;
	}

	.active {
		color: var(--neutral10);
	}

	.active::before {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0.2;
		background-color: var(--neutral100);
	}

	.disabled {
		cursor: not-allowed;
		pointer-events: none;
		opacity: 0.8;
	}
	.disabled::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: var(--neutral900);
		opacity: 0.8;
	}
</style>
