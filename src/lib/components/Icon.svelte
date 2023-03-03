<script lang="ts">
	export let name:
		| 'circle-arrow-right'
		| 'circle-arrow-left'
		| 'arrow-right'
		| 'arrow-left'
		| 'settings'
		| 'x'
		| 'edit'
		| 'player-play'
		| 'lock'
		| 'chart-area-line'
		| 'circle-x'
		| 'grid-dots'
		| 'reload'
		| 'menu-2';
	export let size: 'small' | 'medium' | 'large' = 'medium';

	$: width = size === 'small' ? 18 : size === 'medium' ? 25 : 60;
</script>

{#if name === 'circle-arrow-right'}
	<div class="i-tabler-circle-arrow-right" style="width: {width}px; height: {width}px" />
{:else if name === 'circle-arrow-left'}
	<div class="i-tabler-circle-arrow-left" style="width: {width}px; height: {width}px" />
{:else if name === 'arrow-left'}
	<div class="i-tabler-arrow-left" style="width: {width}px; height: {width}px" />
{:else if name === 'arrow-right'}
	<div class="i-tabler-arrow-right" style="width: {width}px; height: {width}px" />
{:else if name === 'settings'}
	<div class="i-tabler-settings" style="width: {width}px; height: {width}px" />
{:else if name === 'x'}
	<div class="i-tabler-circle-x" style="width: {width}px; height: {width}px" />
{:else if name === 'edit'}
	<div class="i-tabler-edit" style="width: {width}px; height: {width}px" />
{:else if name === 'player-play'}
	<div class="i-tabler-player-play" style="width: {width}px; height: {width}px" />
{:else if name === 'menu-2'}
	<div class="i-tabler-menu-2" style="width: {width}px; height: {width}px" />
{:else if name === 'lock'}
	<div class="i-tabler-lock" style="width: {width}px; height: {width}px" />
{:else if name === 'chart-area-line'}
	<div class="i-tabler-chart-area-line" style="width: {width}px; height: {width}px" />
{:else if name === 'circle-x'}
	<div class="i-tabler-circle-x" style="width: {width}px; height: {width}px" />
{:else if name === 'grid-dots'}
	<div class="i-tabler-grid-dots" style="width: {width}px; height: {width}px" />
{:else if name === 'reload'}
	<div class="i-tabler-reload" style="width: {width}px; height: {width}px" />
{/if}

<style>
	div {
		height: 20px;
		width: 20px;
	}
</style>
