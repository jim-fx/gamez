<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
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
	:global(body[data-theme='dark']) {
		--gradient: linear-gradient(-20deg, #16161e 0%, #252530 96.92%);
		--outline-strong: #81818188;
		--outline: #81818122;
		--text-light: #7c8092;
		--text: #7c8092;
		--text-strong: #b2b8d2;
		--shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25),
			0px 4px 4px rgba(0, 0, 0, 0.25);
	}

	:global(body) {
		--gradient: linear-gradient(-20deg, #16161e 0%, #252530 96.92%);
		--outline-strong: #81818188;
		--outline: #81818122;
		--text-light: #7c8092;
		--text: #7c8092;
		--text-strong: #b2b8d2;
		--shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25),
			0px 4px 4px rgba(0, 0, 0, 0.25);
	}

	:global(body) {
		/* background: var(--gradient); */
		/* background-size: contain; */
		height: 100%;
		margin: 0;
		padding: 0;
	}

	:global(html) {
		height: 100%;
		font-family: 'Nunito', sans-serif;
		background-image: url('data:image/svg+xml;base64, PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCI+CjxmaWx0ZXIgaWQ9Im4iIHg9IjAiIHk9IjAiPgo8ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC43IiBudW1PY3RhdmVzPSIxMCIgc3RpdGNoVGlsZXM9InN0aXRjaCI+PC9mZVR1cmJ1bGVuY2U+CjwvZmlsdGVyPgo8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzAwMCI+PC9yZWN0Pgo8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsdGVyPSJ1cmwoI24pIiBvcGFjaXR5PSIwLjEiPjwvcmVjdD4KPC9zdmc+'),
			linear-gradient(-20deg, #16161e 3.85%, #252530 96.92%);
		background-blend-mode: screen;
	}
</style>
