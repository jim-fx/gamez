<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { decodeSokobanBoard, Editor, encodeSokobanBoard } from '$lib/components/sokoban';
	import Tab from '$lib/components/tab';
	import { copyToClipboard } from '$lib/utils';
	import Levels from './Levels.svelte';
	import { state } from './stores';

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

<div class="copy-level">
	<Tab contentStyle="padding: 0px;">
		<Tab.Content>
			<input bind:value={encoded} />
		</Tab.Content>
		<Tab.Content>
			<Button style="background: none; border: none;" on:click={() => copyToClipboard(encoded)}>
				<Icon size="small" name="copy" />
			</Button>
		</Tab.Content>
	</Tab>
</div>

<Levels bind:state={$state} current={encoded} />

<Editor bind:state={$state} />

<style>
	:global(main) {
		display: grid;
		grid-template-columns: max-content 1fr;
		grid-template-rows: 1fr 300px;
		grid-template-areas: 'levels editor' 'levels controls';
	}
	input {
		width: fit-content;
		padding: 5px;
		background: none;
		border: none;
		color: var(--text);
		text-overflow: ellipsis;
	}

	.copy-level {
		max-width: 50%;
		position: fixed;
		top: 10px;
		right: 10px;
	}
</style>
