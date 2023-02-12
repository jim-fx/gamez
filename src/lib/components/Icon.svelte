<script lang="ts">
	export let name: 'arrow-right' | 'arrow-left';
	export let size: 'small' | 'medium' | 'large' = 'medium';

	$: width = size === 'small' ? 15 : size === 'medium' ? 25 : 60;
</script>

{#if name === 'arrow-right'}
	<div class="i-tabler-circle-arrow-right" style="width: {width}px; height: {width}px" />
{:else if name === 'arrow-left'}
	<div class="i-tabler-circle-arrow-left" style="width: {width}px; height: {width}px" />
{:else if name === 'settings'}
	<div class="i-tabler-settings" style="width: {width}px; height: {width}px" />
{:else if name === 'x'}
	<div class="i-tabler-circle-x" style="width: {width}px; height: {width}px" />
{/if}

<style>
	div {
		height: 20px;
		width: 20px;
	}
</style>
