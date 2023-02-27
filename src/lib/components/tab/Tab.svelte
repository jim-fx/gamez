<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import { createContext } from './context';

	const tabs: { index: Writable<number>; value: string | null }[] = [];

	export let value: string | null = null;

	export let style = '';
	export let contentStyle = '';

	export let showActiveState = false;

	const activeTab: Writable<number> = writable(-1);

	createContext({
		activeTab,
		contentStyle,
		setActiveTab: (index: number) => {
			if (!showActiveState) return;
			activeTab.set(index);
			value = tabs[index].value;
		},
		registerTab: (tabValue?: string) => {
			if (tabValue) {
				if (value === tabValue && showActiveState) {
					activeTab.set(tabs.length);
				}

				if (!value) {
					value = tabValue;
				}
			}

			const index = writable(tabs.length);
			tabs.push({ index, value: tabValue || null });
			return index;
		},
		unregisterTab: (index: number) => {
			tabs.splice(index, 1);
			for (let i = 0; i < tabs.length; i++) {
				tabs[i].index.set(i);
			}
		}
	});
</script>

<div class="wrapper" {style}><slot /></div>

<style>
	.wrapper {
		position: relative;
		width: fit-content;
		display: flex;
		color: var(--neutral100);
		border: 1px solid var(--outline);
		border-radius: 0.5em;
		overflow: hidden;
		background: linear-gradient(120deg, var(--neutral800), var(--neutral850));
	}

	:global(.wrapper > .wrapper:last-child) {
		border: none;
	}
</style>
