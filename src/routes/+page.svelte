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
	import { getSgfOfTheDay } from "@/helpers/sgf";
	import { Board } from "ko-sgf";
	import type { GameBranch, GameTree } from "ko-sgf/dist/types/game-tree";

	let gameTree: GameTree = [];
	let gameBranch: GameBranch = [];

	const sgf = getSgfOfTheDay();
</script>
