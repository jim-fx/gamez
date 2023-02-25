<script lang="ts">
	import Cell from './Cell.svelte';
	import Ball from './Ball.svelte';
	import { getContext, setContext } from './context';
	import { Direction, defaultGame } from './constants';
	import historyStore from '../historyStore';
	import RadialMenu from '../RadialMenu.svelte';
	export let width: number = 5;
	export let height: number = 5;
	export let grid: boolean[] = defaultGame.grid;
	export let balls: number[] = defaultGame.balls;
	export let targets: number[] = defaultGame.targets;

	let wrapper: HTMLElement;

	function arrayToMap<T>(arr: T[]) {
		const map = new Map();
		for (let index = 0; index < arr.length; index++) {
			const element = targets[index];
			map.set(element, index);
		}
		return map;
	}

	$: _targets = arrayToMap(targets);

	const _balls = historyStore(balls);

	function compare<T>(a: T[], b: T[]) {
		for (const i in a) {
			if (a[i] !== b[i]) return false;
		}
		return true;
	}

	export let won = false;
	$: won = compare($_balls, targets);

	function moveBall(ballIndex: number, dir: Direction) {
		if (won) return;
		let ballPos = $_balls[ballIndex];

		const ballPositions = new Set();
		for (let index = 0; index < $_balls.length; index++) {
			if (index === ballIndex) continue;
			ballPositions.add($_balls[index]);
		}

		while (true) {
			const [ballX, ballY] = ctx.getPosition(ballPos);

			const nextX = ballX + (dir === Direction.RIGHT ? 1 : dir === Direction.LEFT ? -1 : 0);
			const nextY = ballY + (dir === Direction.DOWN ? 1 : dir === Direction.UP ? -1 : 0);

			const nextPos = ctx.getIndex(nextX, nextY);

			if (ballPositions.has(nextPos)) {
				break;
			}

			const nextCell = ctx.getCell(nextPos);

			if (!nextCell) {
				break;
			}

			ballPos = nextPos;
		}

		const _b = [...$_balls];
		_b[ballIndex] = ballPos;

		$_balls = _b;
	}

	setContext('sokoban', {
		balls: _balls,
		grid,
		width,
		height,
		moveBall,
		getPosition(index: number) {
			return [index % width, Math.floor(index / width)];
		},
		getIndex(row, col) {
			if (row < 0 || row >= width || col < 0 || col >= height) return -1;
			return row + col * width;
		},
		getCell(index: number) {
			if (index === -1) return null;
			return grid[index];
		}
	});

	const ctx = getContext('sokoban');

	function handleKeyDown(e: KeyboardEvent) {
		const dir = {
			ArrowUp: Direction.UP,
			ArrowDown: Direction.DOWN,
			ArrowLeft: Direction.LEFT,
			ArrowRight: Direction.RIGHT
		}[e.key];

		if (!won) {
			if (dir !== undefined) {
				moveBall(0, dir);
			}
		}

		if (e.key === 'u' && !won) {
			_balls.undo();
		}

		if (e.key === 'r' && !won) {
			_balls.redo();
		}
	}

	const cellSize = 80;

	const items = [
		{
			value: 'undo',
			content: 'Undo'
		},
		{
			value: 'redo',
			content: 'Redo'
		}
	];

	function handleSelect(e: CustomEvent) {
		if (e.detail === 'undo') {
			_balls.undo();
		} else if (e.detail === 'redo') {
			_balls.redo();
		}
	}

	function checkTarget(e: HTMLElement) {
		return e.classList.contains('gamer-wrapper') || e.classList.contains('grid-wrapper');
	}
</script>

<svelte:window on:keydown={handleKeyDown} />

<RadialMenu target={checkTarget} context {items} on:select={handleSelect} rotation={-90} />

<div class="gamer-wrapper" style={`--cell-size: ${cellSize}px;`} bind:this={wrapper}>
	{#each $_balls as pos, i}
		<Ball index={i} position={pos} target={targets[i]} />
	{/each}
	<div
		class="grid-wrapper"
		style={`grid-template-columns: repeat(${width}, 1fr); grid-template-rows: repeat(${height}, 1fr);`}
	>
		{#each grid as cell, i}
			<Cell value={cell} index={i} target={_targets.get(i)} />
		{/each}
	</div>
</div>

<style>
	.grid-wrapper {
		display: grid;
		grid-gap: 0;
		width: fit-content;
	}
</style>
