<script lang="ts">
	import Stars from '$lib/components/star/Stars.svelte';
	import { fade, scale } from 'svelte/transition';
	import { LL } from '$i18n/i18n-svelte';
	import Button from '$lib/components/Button.svelte';
	import { createEventDispatcher } from 'svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Tab from '$lib/components/tab';

	export let rating: number;
	export let steps: number;

	const dispatch = createEventDispatcher();
</script>

<div class="won" in:fade|global={{ delay: 1000 }}>
	<h2 in:scale|global={{ delay: 1500 }}>{$LL.rating[rating.toString()]()}</h2>
	<span in:scale|global={{ delay: 1750 }}>
		<Stars {rating} animate delay={1750} />
	</span>
	<p in:scale|global={{ delay: 1900 }}>{steps} {$LL.steps()}</p>
	<div class="actions" in:scale|global={{ delay: 2000 }}>
		<Tab
			noise
			style="border-radius: 20px;"
			contentStyle="font-size: 0.8em; display: flex; gap: 10px; padding: 10px;"
		>
			{#if rating < 3}
				<Tab.Content on:click={() => dispatch('restart')}>
					<Icon name="reload" size="small" />
					{$LL.try_again()}
				</Tab.Content>
			{/if}

			<span in:scale|global={{ delay: 2200 }}>
				<Tab.Content on:click={() => dispatch('nextlevel')}>
					{$LL.next_level()}
					<Icon name="arrow-right" size="small" />
				</Tab.Content>
			</span>
		</Tab>
	</div>
</div>

<style>
	.won {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		z-index: 20;
		background: var(--neutral900);
		width: 160%;
		height: 160%;
		margin-left: -30%;
		margin-top: -30%;
	}
	.won > p {
		color: var(--text);
	}

	.won > h2 {
		color: var(--neutral10);
		margin: 20px;
		font-size: 4rem;
		white-space: nowrap;
	}

	.won > .actions {
		margin-top: 40px;
	}
</style>
