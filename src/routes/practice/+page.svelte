B to play
{#if hasError}
	<!-- <button on:click={() => handleReset()}>Reset</button> -->
	<button on:click={handleReset}>Reset</button>
{:else if success}
	<p>Success!</p>
	<!-- <button on:click={() => handleReset(true)}>Try again!</button> -->
{/if}

{#key rerender}
	<Board
		{sgf}
		initialMoveNumber={2}
		isInteractive={currentMoveNumber < gameBranch.length && !hasError}
		bind:gameBranch
		bind:boardBranch
		{width}
		{height}
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

	const handleReset = async () => {
		rerender++;
		currentMoveNumber = 2;
	};

	let boardState: BoardState = {};
	let minX = 0;
	let maxX = 19;
	let minY = 0;
	let maxY = 19;
	let width = 19;
	let height = 19;
	let haveDimensionsBeenSet = false;

	const handleMoveMade = (event: CustomEvent) => {
		const { move, boardState: newBoardState } = event.detail;
		console.log({ move, newBoardState });
		currentMoveNumber = move.number;
		boardState = newBoardState;
	};

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

	$: {
		// const currentMoveNumber = boardBranch.length;
		const boardMoveForCurrentMoveNumber = boardBranch[currentMoveNumber - 1];
		const gameMoveForCurrentMoveNumber = gameBranch[currentMoveNumber - 1];

		console.log({ boardMoveForCurrentMoveNumber, gameMoveForCurrentMoveNumber });
		const areBoardMoveAndGameMoveTheSame = areMovesTheSame(
			boardMoveForCurrentMoveNumber,
			gameMoveForCurrentMoveNumber,
		);

		hasError =
			currentMoveNumber > gameBranch.length ||
			(boardMoveForCurrentMoveNumber &&
				gameMoveForCurrentMoveNumber &&
				!areBoardMoveAndGameMoveTheSame);

		console.log({ gameBranch, currentMoveNumber });
		if (currentMoveNumber === gameBranch.length && gameBranch.length > 0) {
			console.log("hey!");
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
