<div class="board-page">
	<h2>Opening of the day</h2>

	<Board isInteractive={false} initialMoveNumber={0} autoSize {sgf} bind:gameTree bind:gameBranch />
</div>

<script lang="ts">
	import { getSgfOfTheDay } from "@/helpers/sgf";
	import { Board } from "ko-sgf";
	import type { GameBranch, GameTree } from "ko-sgf/dist/types/game-tree";

	let gameTree: GameTree = [];
	let gameBranch: GameBranch = [];

	const sgf = getSgfOfTheDay();
</script>

<style lang="scss">
	h2 {
		padding-bottom: 1rem;
	}
</style>
