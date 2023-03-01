<script lang="ts">
	import '../../../routes/global.css';
	import type { Hst } from '@histoire/plugin-svelte';
	export let Hst: Hst;
	import Preview from './Preview.svelte';
	import { decodeSokobanBoard } from './core';
	import Game from '.';

	const level = 'CwUwrgTAbFAMDsBWWBGAHLAzJiKK2nhU1RWQmFQE5Ug';
	const game = decodeSokobanBoard(level);
</script>

<Hst.Story>
	<Hst.Variant title="default">
		<Game state={game} />
	</Hst.Variant>
	<Hst.Variant title="Preview">
		<Preview {level} />
	</Hst.Variant>
</Hst.Story>
