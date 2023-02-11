<script lang="ts">
	export let name: 'arrow-right' | 'arrow-left';
</script>

{#if name === 'arrow-right'}
	<div class="i-tabler-circle-arrow-right" />
{:else if name === 'arrow-left'}
	<div class="i-tabler-circle-arrow-left" />
{:else if name === 'settings'}
	<div class="i-tabler-settings" />
{/if}

<style>
	div {
		height: 20px;
		width: 20px;
	}
</style>
