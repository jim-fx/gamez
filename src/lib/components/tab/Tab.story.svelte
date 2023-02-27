<script lang="ts">
	import '../../../routes/global.css';
	import type { Hst } from '@histoire/plugin-svelte';
	export let Hst: Hst;
	import Tab from '.';
</script>

<Hst.Story>
	<Tab>
		<Tab.Content>a</Tab.Content>
		<Tab.Content>b</Tab.Content>
	</Tab>
</Hst.Story>
