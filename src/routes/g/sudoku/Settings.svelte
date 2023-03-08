<script lang="ts">
	import Tab from '$lib/components/tab';
	import Header from './Header.svelte';
	import { settings } from './stores';
</script>

<div class="outer-wrapper">
	<Header name="settings" />
	<div class="content">
		<p>difficulty</p>
		<Tab
			showActiveState
			style="width: 100%; border: none; background: none; border-radius: 0px;"
			bind:value={$settings.difficulty}
			contentStyle="flex: 1;"
		>
			<Tab.Content value="easy">easy</Tab.Content>
			<Tab.Content value="medium">medium</Tab.Content>
			<Tab.Content value="hard">hard</Tab.Content>
			<Tab.Content value="expert">expert</Tab.Content>
		</Tab>
	</div>
</div>

<style>
	.outer-wrapper {
		display: grid;
		height: 100%;
		grid-template-rows: min-content 1fr;
	}
	.content {
		display: grid;
		grid-template-columns: max-content 1fr;
		grid-template-rows: repeat(auto-fill, minmax(0px, max-content));
	}

	.content {
		height: fit-content;
		border-bottom: 1px solid var(--outline);
	}

	p {
		padding: 1em;
		margin: 0;
		color: var(--text);
		border-right: 1px solid var(--outline);
	}
</style>
