<script lang="ts">
	import { onMount } from 'svelte';
	import { RadialMenu } from '$lib/components';

	onMount(() => {
		console.log('Page loaded');
	});

	const items = [
		{
			value: 'forward',
			icon: 'arrow-right'
		},
		{
			value: 'back',
			icon: 'arrow-left'
		},
		{
			value: 'settings',
			icon: 'settings'
		}
	];
</script>

<RadialMenu {items} />
