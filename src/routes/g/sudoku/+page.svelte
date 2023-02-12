<script lang="ts">
	import { RadialMenu, Sudoku } from '$lib/components';

	const grid = Sudoku.makepuzzle();
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
