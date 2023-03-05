<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	export let Hst: Hst;
	import Number from './Number.svelte';
</script>

<Hst.Story>
	<Number />
	<svelte:fragment slot="controls" />
</Hst.Story>
