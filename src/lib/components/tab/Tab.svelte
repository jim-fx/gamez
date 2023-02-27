<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import { createContext } from './context';

	const tabs: { index: Writable<number>; value: string | null }[] = [];

	export let value: string | null = null;

	const activeTab: Writable<number> = writable(0);

	createContext({
		activeTab,
		setActiveTab: (index: number) => {
			activeTab.set(index);
			value = tabs[index].value;
		},
		registerTab: (tabValue?: string) => {
			if (tabValue) {
				if (value === tabValue) {
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

<div class="wrapper"><slot /></div>

<style>
	.wrapper {
		width: fit-content;
		display: flex;
		color: var(--neutral100);
		background-color: var(--neutral800);
		border: 1px solid var(--neutral100);
		border-radius: 0.5em;
		overflow: hidden;
	}

	:global(.wrapper > .wrapper:last-child) {
		border: none;
	}
</style>
