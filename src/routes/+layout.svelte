<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { setLocale } from '../i18n/i18n-svelte';
	import { RadialMenu } from '$lib/components';
	import '@fontsource/nunito';
	import 'uno.css';
	import './global.css';

	import type { LayoutData } from './$types';
	import { fade } from 'svelte/transition';
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

	function checkTarget(e: HTMLElement) {
		return e.nodeName === 'MAIN';
	}
</script>

<svelte:head>
	<script
		async
		defer
		src="https://analytics.umami.is/script.js"
		data-website-id="3929a322-b527-4134-8d06-9d7799748232"
	></script>
</svelte:head>

<RadialMenu target={checkTarget} {items} on:select={handleSelect} />
{#key data.pathname}
	<main bind:this={body} in:fade={{ duration: 200, delay: 200 }} out:fade={{ duration: 100 }}>
		<slot />
	</main>
{/key}

<style>
	main {
		height: 100%;
	}
</style>
