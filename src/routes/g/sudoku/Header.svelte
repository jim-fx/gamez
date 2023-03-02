<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';

	export let name: string;
</script>

<div class="wrapper">
	<h2>{name}</h2>
</div>

<style>
	.wrapper {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem 1rem;
		color: var(--text);
		border-bottom: 1px solid var(--outline);
	}

	h2 {
		margin: 0;
		font-weight: 200;
		font-size: 1.2rem;
	}
</style>
