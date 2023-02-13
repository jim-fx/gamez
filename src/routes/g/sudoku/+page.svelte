<script lang="ts">
	import { Sudoku } from '$lib/components';
	import { getSudoku } from 'sudoku-gen';

	function genSudoku() {
		const d = getSudoku('easy');
		return d.puzzle.split('').map((x) => (x === '-' ? null : parseInt(x)));
	}

	const grid = genSudoku();
</script>

<Sudoku {grid} />

<style>
	:global(body) {
		display: grid;
		place-items: center;
		height: 100vh;
		width: 100vw;
	}
</style>
