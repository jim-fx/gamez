<script lang="ts">
	export let amount = 5;
	export let rating = 0;
	export let interactive: boolean | null;
	import star from './star.png';

	function handleClick(index: number) {
		if (!interactive) return;
		rating = index + 1;
	}

	function handleKeyPress(e: KeyboardEvent, index: number) {
		if (!interactive) return;
		if (e.key === 'Enter') {
			rating = index + 1;
		}
	}
</script>

<div class="wrapper" class:interactive>
	{#each new Array(amount) as _, i}
		<div
			class="star"
			class:enabled={i < rating}
			style={`--star-url: url(${star})`}
			on:click={() => handleClick(i)}
			on:keypress={(e) => handleKeyPress(e, i)}
		>
			<svg
				width="101"
				height="101"
				viewBox="0 0 101 101"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M55.4054 4.22945L66.8682 26.9356C67.7899 28.7613 69.4751 30.0462 71.4385 30.4012L95.6433 34.7782C99.9023 35.5483 101.648 41.0337 98.5916 44.3205L81.4712 62.7306C80.0914 64.2144 79.4524 66.2773 79.7328 68.3152L83.2294 93.7265C83.8562 98.2813 79.3646 101.607 75.5089 99.6256L53.4651 88.2976C51.6797 87.3801 49.5859 87.3801 47.8006 88.2976L25.7567 99.6256C21.901 101.607 17.4094 98.2813 18.0362 93.7265L21.5328 68.3152C21.8133 66.2773 21.1743 64.2144 19.7945 62.7306L2.67399 44.3205C-0.382572 41.0337 1.36336 35.5483 5.62229 34.7782L29.8272 30.4012C31.7905 30.0462 33.4758 28.7613 34.3974 26.9356L45.8602 4.22946C47.8894 0.210057 53.3763 0.210052 55.4054 4.22945Z"
				/>
			</svg>
		</div>
	{/each}
</div>

<style>
	.wrapper {
		display: flex;
		width: fit-content;
		gap: 10px;
		padding: 10px;
		border-radius: 10px;
		border: solid 2px var(--neutral100);
		background: var(--neutral800);
		overflow: visible;
	}

	svg {
		height: 100%;
		width: 100%;
		overflow: visible;
	}

	.interactive .star {
		cursor: pointer;
	}

	.interactive .star:hover {
		opacity: 0.8;
	}

	.interactive .star:hover::after {
		opacity: 0.5;
		transform: scale(0.8);
	}

	.interactive .star:enabled:hover::after {
		transform: scale(0.95) !important;
		opacity: 0.95 !important;
	}

	.star {
		position: relative;
		width: 30px;
		height: 30px;
		will-change: transform;
	}

	.star::after {
		content: '';
		position: absolute;
		height: 100%;
		width: 100%;
		left: 0;
		top: 0;
		background-image: var(--star-url);
		background-size: contain;
		background-repeat: no-repeat;
		opacity: 0;
		transition: opacity 0.1s, filter 0.5s ease, transform 0.3s var(--ease);
		transform: scale(0.5);
		filter: drop-shadow(4px 4px 1px rgba(0, 0, 0, 0.1));
	}

	.star.enabled::after {
		opacity: 1;
		transform: scale(1);
		filter: drop-shadow(4px 4px 6px rgba(0, 0, 0, 0.2));
	}

	.star.enabled svg {
		opacity: 0;
	}

	.star.enabled g {
		filter: url(#filter0_dii_40_319);
	}

	.star path {
		stroke-width: 5px;
		stroke: var(--neutral100);
	}
</style>
