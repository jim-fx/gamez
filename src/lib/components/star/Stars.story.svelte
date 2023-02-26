<script lang="ts">
	import '../../../routes/global.css';
	import type { Hst } from '@histoire/plugin-svelte';
	export let Hst: Hst;
	import Stars from './Stars.svelte';

	let amount = 5;
	let rating = 2;
	let interactive = false;
</script>

<Hst.Story>
	<Stars bind:rating {amount} {interactive} />

	<svelte:fragment slot="controls">
		<input type="number" max="5" min="0" step="1" bind:value={rating} />
		<br />
		<label for="interactive">Interactive</label>
		<input id="interactive" type="checkbox" bind:checked={interactive} />
		{interactive}
	</svelte:fragment>
</Hst.Story>
