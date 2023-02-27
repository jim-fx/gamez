<script lang="ts">
	import { Editor, encodeSokobanBoard } from '$lib/components/sokoban';
	import { compressArray } from '$lib/components/sokoban/utils';
	import localStore from '$lib/localStore';

	const state = localStore('sokoban-editor-state', {
		width: 5,
		height: 5,
		cells: [],
		targets: [],
		balls: [],
		steps: {
			best: 0,
			worst: 0
		},
		difficulty: 0
	});
	$: save = encodeSokobanBoard($state);
</script>

<p>{save}</p>
<Editor bind:state={$state} />
