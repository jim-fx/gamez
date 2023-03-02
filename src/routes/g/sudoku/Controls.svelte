<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import Tab from '$lib/components/tab';
	import { cubicOut } from 'svelte/easing';
	import { view } from './stores';

	import { custom } from './stores';

	let undoPossible = false;
	let redoPossible = false;

	$: if ($custom) {
		redoPossible = custom.nextValue !== null;
	}

	$: if ($custom) {
		undoPossible = custom.previousValue !== null;
	}

	function scale(
		node: HTMLElement,
		{ delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 } = {}
	) {
		const style = getComputedStyle(node);
		const target_opacity = +style.opacity;
		const transform = style.transform === 'none' ? '' : style.transform;
		const sd = 1 - start;
		const od = target_opacity * (1 - opacity);
		return {
			delay,
			duration,
			easing: easing,
			css: (_t: number, u: number) => `
        transform: ${transform} scaleX(${1 - sd * u});
        opacity: ${target_opacity - od * u}
      `
		};
	}
</script>

<Tab
	bind:value={$view}
	showActiveState
	noise
	contentStyle={`padding: 0.8em;`}
	style={`border-radius: 20px; `}
>
	{#if $view === 'game'}
		<div transition:scale style={`transform-origin: 100% 0%`}>
			<Tab.Content on:click={() => custom.undo()} disabled={!undoPossible}
				><Icon size="small" name="arrow-left" /></Tab.Content
			>
		</div>
	{/if}
	<Tab.Content value="settings"><Icon size="small" name="settings" /></Tab.Content>
	<Tab.Content value="game"><Icon size="small" name="grid-dots" /></Tab.Content>
	<Tab.Content value="statistics"><Icon size="small" name="chart-area-line" /></Tab.Content>
	{#if $view === 'game'}
		<div transition:scale style={`transform-origin: 0% 0%`}>
			<Tab.Content on:click={() => custom.redo()} disabled={!redoPossible}
				><Icon size="small" name="arrow-right" /></Tab.Content
			>
		</div>
	{/if}
</Tab>
