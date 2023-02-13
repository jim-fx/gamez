<script lang="ts">
	import { goto } from '$app/navigation';
	import { RadialMenu } from '$lib/components';
	import '@fontsource/nunito';
	import { onMount } from 'svelte';
	import 'uno.css';

	export const prerender = true;

	const items = [
		{
			value: 'sudoku',
			content: 'sudoku'
		},
		{
			value: 'kublot',
			content: 'Kublot'
		},
		{
			value: 'settings',
			icon: 'settings'
		}
	];

	function handleSelect(e: CustomEvent<string>) {
		console.log(e.detail);
		if (e.detail === 'sudoku') {
			goto('/g/sudoku');
		}

		if (e.detail === 'kublot') {
			goto('/g/kublot');
		}

		if (e.detail === 'settings') {
			goto('/settings');
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
	:global(body[data-theme='dark']) {
		--gradient: linear-gradient(135.06deg, #16161e 0%, #252530 96.92%);
		--outline-strong: #81818188;
		--outline: #81818144;
		--text-light: #7c8092;
		--text: #7c8092;
		--text-strong: #b2b8d2;
		--shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25),
			0px 4px 4px rgba(0, 0, 0, 0.25);
	}

	:global(body) {
		--gradient: linear-gradient(135.06deg, #16161e 0%, #252530 96.92%);
		--outline-strong: #81818188;
		--outline: #81818144;
		--text-light: #7c8092;
		--text: #7c8092;
		--text-strong: #b2b8d2;
		--shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25),
			0px 4px 4px rgba(0, 0, 0, 0.25);
	}

	:global(body) {
		background: var(--gradient);
		background-size: contain;
		height: 100%;
		margin: 0;
		padding: 0;
	}

	:global(html) {
		height: 100%;
		font-family: 'Nunito', sans-serif;
	}
</style>
