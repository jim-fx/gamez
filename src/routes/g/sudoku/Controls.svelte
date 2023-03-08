<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import Tab from '$lib/components/tab';
	import { view } from './stores';

	import { custom } from './stores';

	let undoPossible = false;
	let redoPossible = false;

	$: if ($custom) {
		redoPossible = custom.nextValue !== null;
	}

	$: if ($custom) {
		undoPossible = custom.previousValue !== null;
	}

	$: tabStyle = `
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1), padding 0.4s cubic-bezier(0.4, 0, 0.2, 1), margin 0.3s ease, opacity 0.3s ease;
    width: ${$view === 'game' ? '18px' : '0px'} !important;
    padding: ${$view === 'game' ? '0.8em' : '0.8em 0em'} !important;
    opacity: ${$view === 'game' ? '1' : '0'} !important;
    margin: ${$view === 'game' ? '0em' : '-1px'} !important;
    pointer-events: ${$view === 'game' ? 'auto' : 'none'} !important;
  `;
</script>

<div class="wrapper">
	<Tab
		bind:value={$view}
		showActiveState
		noise
		contentStyle={`padding: 0.8em;`}
		style={`border-radius: 20px; `}
	>
		<Tab.Content style={tabStyle} on:click={() => custom.undo()} disabled={!undoPossible}>
			<Icon size="small" name="arrow-left" />
		</Tab.Content>
		<Tab.Content value="settings"><Icon size="small" name="settings" /></Tab.Content>
		<Tab.Content value="game"><Icon size="small" name="grid-dots" /></Tab.Content>
		<Tab.Content value="statistics"><Icon size="small" name="chart-area-line" /></Tab.Content>
		<Tab.Content style={tabStyle} on:click={() => custom.redo()} disabled={!redoPossible}>
			<Icon size="small" name="arrow-right" />
		</Tab.Content>
	</Tab>
</div>

<style>
	.wrapper {
		position: absolute;
		bottom: 20px;
	}
</style>
