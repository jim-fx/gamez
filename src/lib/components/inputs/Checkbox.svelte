<script lang="ts">
	export let checked = false;
</script>

<input type="checkbox" bind:checked class="checkbox" />

<style>
	input[type='checkbox'] {
		appearance: none;
		margin: 0;

		font: inherit;
		width: 1.15em;
		height: 1.15em;
		border: 2px solid var(--outline);
		background: var(--neutral800);
		border-radius: 0.2em;

		cursor: pointer;

		display: grid;
		place-content: center;
	}

	input[type='checkbox']::before {
		content: '';
		width: 0.5em;
		height: 0.5em;
		transform: scale(0);
		transform-origin: center;
		transition: 120ms transform ease-in-out;
		background-color: var(--outline);
		border-radius: 0.1em;
	}

	input[type='checkbox']:checked::before {
		transform: scale(0.7);
	}

	input[type='checkbox']:focus {
	}

	input[type='checkbox']:disabled {
		cursor: not-allowed;
	}
</style>
