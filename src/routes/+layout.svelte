<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { setLocale } from '../i18n/i18n-svelte';
	import { RadialMenu } from '$lib/components';
	import '@fontsource/nunito';
	import { onMount } from 'svelte';
	import 'uno.css';
	import './global.css';

	import type { LayoutData } from './$types';
	export let data: LayoutData;

	setLocale(data.locale);

	const items = [
		{
			value: 'sudoku',
			content: 'sudoku'
		},
		{
			value: 'sokoban',
			content: 'sokoban'
		},
		{
			value: 'settings',
			icon: 'settings'
		}
	];

	function handleSelect(e: CustomEvent<string>) {
		if (e.detail === 'sudoku') {
			goto(base + '/g/sudoku');
		}

		if (e.detail === 'sokoban') {
			goto(base + '/g/sokoban');
		}

		if (e.detail === 'settings') {
			goto(base + '/settings');
		}
	}

	let body: HTMLElement | null = null;

	onMount(() => {
		import('virtual:unocss-devtools');
		body = document.body;
	});
</script>

<RadialMenu target={body} {items} on:select={handleSelect} />
<svelte:body bind:this={body} />

<slot />

<style global>
</style>
