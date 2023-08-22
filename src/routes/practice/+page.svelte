<div class="info-area">
	B to play inverseColors: {inverseColors}
	axisToFlipBoard: {axisToFlipBoard}
	boardRotationAngle: {boardRotationAngle}
	{#if hasError}
		<button on:click={() => handleReset()}>Reset</button>
		<!-- <button on:click={handleReset}>Reset</button> -->
	{:else if success}
		<p>Success!</p>
		<button on:click={() => handleReset(true)}>Try again!</button>
	{/if}
</div>

{#key rerender}
	<Board
		{sgf}
		initialMoveNumber={2}
		isInteractive={currentMoveNumber < gameBranch.length && !hasError}
		bind:gameBranch
		bind:boardBranch
		turn={inverseColors ? "W" : "B"}
		{inverseColors}
		{axisToFlipBoard}
		{boardRotationAngle}
		autoSize
		on:moveMade={handleMoveMade}
	/>
{/key}

<script lang="ts">
	import { onMount, tick } from "svelte";
	import { Board } from "ko-sgf";
	import type { GameBranch, GameNode } from "ko-sgf/dist/types/game-tree";
	import type { BoardState } from "ko-sgf/dist/types/board-state";

	// TODO shouldn't be binding these lol
	let gameBranch: GameBranch = [];
	let boardBranch: GameBranch = gameBranch.slice(0, 2);

	let hasError = false;
	let success = false;
	let rerender = 0;
	let currentMoveNumber = 2;

	let inverseColors = false;
	let axisToFlipBoard: "x" | "y" | "xy" | null = null;
	let boardRotationAngle: 0 | 90 | 180 | 270 = 0;

	let boardState: BoardState = {};
	let haveDimensionsBeenSet = false;

	const handleReset = async (randomize = false) => {
		if (randomize) {
			haveDimensionsBeenSet = false;
			const axisOptions = ["x", "y", "xy", null];
			const boardRotationAngleOptions = [0, 90, 180, 270];

			inverseColors = Math.random() > 0.5;

			axisToFlipBoard = axisOptions[Math.floor(Math.random() * 4)] as "x" | "y" | "xy" | null;
			// boardRotationAngle = boardRotationAngleOptions[Math.floor(Math.random() * 4)] as
			// 	| 0
			// 	| 90
			// 	| 180
			// 	| 270;
		}

		hasError = false;
		success = false;
		rerender++;
		currentMoveNumber = 2;
	};

	const handleMoveMade = (event: CustomEvent) => {
		const { move, boardState: newBoardState } = event.detail;
		console.log({ move, newBoardState });
		currentMoveNumber = move.number;
		boardState = newBoardState;
	};

	$: {
		const boardMoveForCurrentMoveNumber = boardBranch[currentMoveNumber - 1];
		const gameMoveForCurrentMoveNumber = gameBranch[currentMoveNumber - 1];

		const areBoardMoveAndGameMoveTheSame = areMovesTheSame(
			boardMoveForCurrentMoveNumber,
			gameMoveForCurrentMoveNumber,
		);

		console.log({ boardMoveForCurrentMoveNumber, gameMoveForCurrentMoveNumber, gameBranch });

		hasError =
			currentMoveNumber > gameBranch.length ||
			(boardMoveForCurrentMoveNumber &&
				gameMoveForCurrentMoveNumber &&
				!areBoardMoveAndGameMoveTheSame);

		if (currentMoveNumber === gameBranch.length && gameBranch.length > 0) {
			success = areBoardMoveAndGameMoveTheSame;
		}
	}

	const areMovesTheSame = (move1: GameNode, move2: GameNode) => {
		return (
			(move1 == null && move2 == null) ||
			(move1?.color === move2?.color &&
				move1?.number === move2?.number &&
				move1?.x === move2?.x &&
				move1?.y === move2?.y)
		);
	};

	const mainBranchTest =
		"(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[19]DT[2023-08-18];B[dd];W[cd];B[dc](;W[de])(;W[cc]))";
	let sgf = mainBranchTest;

	onMount(() => {
		boardBranch = gameBranch.slice(0, 2);
	});
</script>

<style lang="scss">
	.info-area {
		height: 100px;
	}
</style>
