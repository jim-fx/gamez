<script lang="ts">
	import Stars from '$lib/components/star/Stars.svelte';
	import { fade, scale } from 'svelte/transition';
	import { LL } from '$i18n/i18n-svelte';
	import Button from '$lib/components/Button.svelte';
	import { createEventDispatcher } from 'svelte';
	import Icon from '$lib/components/Icon.svelte';

	export let rating: number;
	export let steps: number;

	const dispatch = createEventDispatcher();
</script>

<div class="won" in:fade={{ delay: 1000 }}>
	<h2 in:scale={{ delay: 1500 }}>{$LL.rating[rating.toString()]()}</h2>
	<span in:scale={{ delay: 1750 }}>
		<Stars {rating} animate delay={1750} />
	</span>
	<p in:scale={{ delay: 1900 }}>{steps} {$LL.steps()}</p>
	<div class="actions">
		<span class="won-actions" in:scale={{ delay: 2000 }}>
			{#if rating < 3}
				<Button on:click={() => dispatch('restart')}>
					<Icon name="reload" size="small" />
					{$LL.try_again()}
				</Button>
			{/if}

			<span in:scale={{ delay: 2200 }}>
				<Button on:click={() => dispatch('nextlevel')}>
					next level
					<Icon name="arrow-right" size="small" />
				</Button>
			</span>
		</span>
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

	.won-actions {
		display: flex;
		gap: 2rem;
	}
</style>
