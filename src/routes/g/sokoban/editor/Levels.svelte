<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { decodeSokobanBoard, type BoardState } from '$lib/components/sokoban/core';
	import Preview from '$lib/components/sokoban/Preview.svelte';
	import levels from '../levels';

	export let state: BoardState;
	export let current: string;

	let visible = true;
</script>

<div class="outer" class:visible>
	<div class="wrapper">
		<div class="levels-header">
			<h1>Levels</h1>
			<Button
				style="background: none; border: none; padding: 0px;"
				on:click={() => (visible = !visible)}
			>
				<Icon name={visible ? 'x' : 'menu-2'} />
			</Button>
		</div>
		<div class="levels">
			{#if !levels.includes(current)}
				<div class="level">
					<Button>new</Button>
				</div>
			{/if}
			<table>
				{#each levels as level, i}
					<tr
						class="level"
						class:active={level === current}
						on:click={() => (state = decodeSokobanBoard(level))}
					>
						<td>
							<p>Level {i}</p>
						</td>
						<td>
							<Preview {level} />
						</td>
					</tr>
				{/each}
			</table>
		</div>
	</div>
</div>

<style>
	.outer {
		position: relative;
		background: var(--gradient);
		border-right: 1px solid var(--outline);
		grid-area: levels;
	}

	.wrapper {
		height: 100vh;
	}

	.levels-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 15px;
		border-bottom: 1px solid var(--outline);
	}

	h1 {
		margin: 0px;
		font-weight: lighter;
		color: var(--text);
	}

	table {
		width: 100%;
		display: block;
		border-collapse: collapse;
	}

	.levels {
		max-height: calc(100vh - 64px);
		overflow-y: auto;
	}

	.level {
		display: block;
		padding: 10px 15px;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		box-sizing: border-box;
		color: var(--text);
		border-bottom: 1px solid var(--outline);
	}

	.level p {
		margin-right: 20px;
	}

	.wrapper {
		grid-area: levels;
		width: 250px;
		margin-left: -195px;
		transition: margin-left 0.5s ease;
	}

	.visible .wrapper {
		margin-left: 0px;
	}

	.active {
		background: var(--neutral700);
	}
</style>
