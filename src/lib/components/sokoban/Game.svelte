<script lang="ts">
	import type { BoardState } from './core';
	import Grid from './Grid.svelte';
	import { defaultGame, Direction } from './constants';
	import { cellSize } from './constants';
	import { getContext, setContext } from './context';
	import historyStore from '$lib/historyStore';
	import RadialMenu from '../RadialMenu.svelte';
	import { compare } from './utils';

	export let state: BoardState = defaultGame;
	$: ({ width, height } = state);
	export let won = false;

	let wrapper: HTMLElement;

	const balls = historyStore(state.balls.map((b) => b.start));
	$: targets = state.balls.map((b) => b.target);
	$: won = compare($balls, targets);

	function calculateNextPosition(ballIndex: number, dir: Direction) {
		let ballPos = $balls[ballIndex];

		const ballPositions = new Set();
		for (let index = 0; index < $balls.length; index++) {
			if (index === ballIndex) continue;
			ballPositions.add($balls[index]);
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
		return ballPos;
	}

	function moveBall(ballIndex: number, dir: Direction) {
		if (won) return;

		const ballPos = calculateNextPosition(ballIndex, dir);

		const _b = [...$balls];
		_b[ballIndex] = ballPos;

		$balls = _b;
	}

	function getPossibleMoves(ballIndex: number) {
		return [Direction.UP, Direction.RIGHT, Direction.DOWN, Direction.LEFT].map((dir) =>
			calculateNextPosition(ballIndex, dir)
		);
	}

	setContext('sokoban', {
		balls: balls,
		cells: state.cells,
		width: state.width,
		height: state.height,
		moveBall,
		getPossibleMoves,
		getPosition(index: number) {
			return [index % width, Math.floor(index / width)];
		},
		getIndex(row, col) {
			if (row < 0 || row >= width || col < 0 || col >= height) return -1;
			return row + col * width;
		},
		getCell(index: number) {
			if (index < 0 || index > state.cells.length - 1) return null;
			return state.cells[index] === 1;
		}
	});

	const ctx = getContext('sokoban');

	function handleKeyDown(e: KeyboardEvent) {
		const dir = {
			ArrowDown: Direction.DOWN,
			ArrowUp: Direction.UP,
			ArrowLeft: Direction.LEFT,
			ArrowRight: Direction.RIGHT
		}[e.key];

		if (!won) {
			if (dir !== undefined) {
				moveBall(0, dir);
			}
		}

		if (e.key === 'u' && !won) {
			balls.undo();
		}

		if (e.key === 'r' && !won) {
			balls.redo();
		}
	}

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
			balls.undo();
		} else if (e.detail === 'redo') {
			balls.redo();
		}
	}

	function checkTarget(e: HTMLElement) {
		return e.classList.contains('gamer-wrapper') || e.classList.contains('grid-wrapper');
	}
</script>

<svelte:window on:keydown={handleKeyDown} />

<RadialMenu target={checkTarget} {items} on:select={handleSelect} rotation={-90} />
<div class="gamer-wrapper" style={`--cell-size: ${cellSize}px;`} bind:this={wrapper}>
	<Grid width={state.width} height={state.height} cells={state.cells} balls={$balls} {targets} />
</div>
