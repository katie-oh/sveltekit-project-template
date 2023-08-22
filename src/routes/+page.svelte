<h2>Opening of the day</h2>

<Board
	displayControls={true}
	isInteractive={false}
	inverseColors
	{sgf}
	{width}
	{height}
	bind:gameTree
	bind:gameBranch
/>

<script lang="ts">
	import { Board } from "ko-sgf";
	import type { BoardState } from "ko-sgf/dist/types/board-state";
	import type { GameBranch, GameTree } from "ko-sgf/dist/types/game-tree";

	let gameTree: GameTree = [];
	let gameBranch: GameBranch = [];

	let width = 19;
	let height = 19;
	let haveDimensionsBeenSet = false;

	const mainBranchTest =
		"(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[19]DT[2023-08-18];B[dd];W[cd];B[dc](;W[de])(;W[cc]))";

	const sgf = mainBranchTest;
	let boardState: BoardState = {};
	let minX = 0;
	let maxX = 19;
	let minY = 0;
	let maxY = 19;

	$: {
		if (boardState) {
			const xValues = Object.keys(boardState).map((x) => parseInt(x));
			minX = xValues.length > 0 ? Math.min(...xValues) : 0;
			maxX = xValues.length > 0 ? Math.max(...xValues) : 19;

			const yValues = xValues
				.map((x) => {
					return Object.keys(boardState[x]).map((y) => parseInt(y));
				})
				.flat();
			minY = yValues.length > 0 ? Math.min(...yValues) : 0;
			maxY = yValues.length > 0 ? Math.max(...yValues) : 19;

			if (!haveDimensionsBeenSet && xValues.length > 0 && yValues.length > 0) {
				haveDimensionsBeenSet = true;
				width = Math.min(19, maxX + 3);
				height = Math.min(19, maxY + 3);
			}
		}
	}
</script>
