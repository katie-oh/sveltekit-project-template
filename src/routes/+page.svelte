<h2>Opening of the day</h2>

<Board
	displayControls={true}
	isInteractive={false}
	initialMoveNumber={0}
	autoSize
	{sgf}
	bind:gameTree
	bind:gameBranch
/>

<script lang="ts">
	import { Board } from "ko-sgf";
	import type { GameBranch, GameTree } from "ko-sgf/dist/types/game-tree";

	let gameTree: GameTree = [];
	let gameBranch: GameBranch = [];

	const mainBranchTest =
		"(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[19]DT[2023-08-18];B[dd];W[cd];B[dc](;W[de])(;W[cc]))";

	const sgf = mainBranchTest;
</script>
