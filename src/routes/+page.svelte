<script lang="ts">
	import { onMount } from 'svelte';
	import { RadialMenu } from '$lib/components';

	onMount(() => {
		console.log('Page loaded');
	});

	const items = new Array(9).fill(null).map((_, i) => {
		return {
			value: '' + i,
			icon: `${i + 1}`
		};
	});
</script>

<RadialMenu {items} />
