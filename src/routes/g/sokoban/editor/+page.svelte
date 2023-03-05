<script lang="ts">
	import { decodeSokobanBoard, Editor, encodeSokobanBoard } from '$lib/components/sokoban';
	import type { BoardState } from '$lib/components/sokoban/core';
	import localStore from '$lib/localStore';

	const state = localStore<BoardState>('sokoban-editor-state', {
		width: 5,
		height: 5,
		cells: [],
		balls: [],
		steps: {
			best: 0,
			worst: 0
		},
		difficulty: 0
	});
	let encoded = encodeSokobanBoard($state);
	let oldEncoded = encoded;

	$: if ($state) {
		const newEncoded = encodeSokobanBoard($state);
		if (newEncoded !== oldEncoded) {
			encoded = newEncoded;
			oldEncoded = newEncoded;
		}
	}

	$: if (encoded) {
		try {
			if (encoded !== oldEncoded) {
				const decoded = decodeSokobanBoard(encoded);
				state.set(decoded);
				oldEncoded = encoded;
			}
		} catch {
			console.log('Invalid board');
			encoded = oldEncoded;
		}
	}
</script>

<input bind:value={encoded} />
<Editor bind:state={$state} />

<style>
	:global(main) {
		display: grid;
		padding-top: 20vh;
		justify-content: center;
	}
	input {
		width: fit-content;
		max-width: 50%;
		position: fixed;
		top: 10px;
		left: 10px;
		border-radius: 5px;
		padding: 5px;
		background: var(--neutral800);
		border: 1px solid var(--outline);
		color: var(--text);
	}
</style>
