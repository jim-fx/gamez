<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import { createContext } from './context';

	const tabs: { index: Writable<number>; value: string | undefined }[] = [];

	export let value: string | undefined = undefined;

	export let noise = false;

	export let style = '';
	export let contentStyle = '';

	export let showActiveState = false;

	const activeTab: Writable<number> = writable(-1);

	createContext({
		activeTab,
		contentStyle,
		setActiveTab: (index: number) => {
			if (!showActiveState) return;
			if (tabs[index].value !== undefined) {
				activeTab.set(index);
				value = tabs[index].value;
			}
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
			tabs.push({ index, value: tabValue || undefined });
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

<div class="wrapper" class:noise {style}><slot /></div>

<style>
	.wrapper {
		position: relative;
		width: fit-content;
		display: flex;
		color: var(--neutral100);
		border: 1px solid var(--outline);
		border-radius: 1em;
		overflow: hidden;
		background: linear-gradient(120deg, var(--neutral800), var(--neutral850));
	}

	.wrapper.noise::before {
		content: '';
		position: absolute;
		height: 100%;
		width: 100%;
		background: url(/noise.png);
		background-size: 100px;
		opacity: 0.3;
		background-attachment: fixed;
		pointer-events: none;
	}

	.wrapper > :global(div:last-child),
	.wrapper > :global(div:last-child > .tab-content-wrapper) {
		border: none;
	}
</style>
