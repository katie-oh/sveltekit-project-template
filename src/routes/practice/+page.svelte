<div class="info-area">
	You are {usersColor}
	{#if hasError}
		<button on:click={() => handleReset()}>Reset</button>
	{:else if success}
		<p>Success!</p>
		<button on:click={() => handleReset(true)}>Keep practicing!</button>
	{/if}
</div>

{#key rerender}
	<Board
		{sgf}
		initialMoveNumber={2}
		isInteractive={isUsersTurn && currentMoveNumber < gameBranch.length && !hasError}
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
	import { Board, goToNextMove } from "ko-sgf";
	import type { GameBranch, GameNode } from "ko-sgf/dist/types/game-tree";
	import type { BoardState } from "ko-sgf/dist/types/board-state";
	import { getSgfOfTheDay } from "@/helpers/sgf";

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

	let usersColor = Math.random() > 0.5 ? "B" : "W";
	let isUsersTurn = Math.random() > 0.5;

	const handleReset = async (randomize = false) => {
		if (randomize) {
			const axisOptions = ["x", "y", "xy", null];
			const boardRotationAngleOptions = [0, 90, 180, 270];

			inverseColors = Math.random() > 0.5;

			axisToFlipBoard = axisOptions[Math.floor(Math.random() * 4)] as "x" | "y" | "xy" | null;
			boardRotationAngle = boardRotationAngleOptions[Math.floor(Math.random() * 4)] as
				| 0
				| 90
				| 180
				| 270;
		}

		hasError = false;
		success = false;
		rerender++;
		currentMoveNumber = 2;
	};

	const handleMoveMade = (event: CustomEvent) => {
		const { move, boardState: newBoardState } = event.detail;
		currentMoveNumber = move.number;
		boardState = newBoardState;
	};

	$: {
		isUsersTurn = inverseColors
			? usersColor === "B"
				? currentMoveNumber % 2 === 1
				: currentMoveNumber % 2 === 0
			: usersColor === "B"
			? currentMoveNumber % 2 === 0
			: currentMoveNumber % 2 === 1;

		if (!isUsersTurn) {
			setTimeout(() => {
				goToNextMove();
			}, 500);
		}
	}

	$: {
		const boardMoveForCurrentMoveNumber = boardBranch[currentMoveNumber - 1];
		const gameMoveForCurrentMoveNumber = gameBranch[currentMoveNumber - 1];

		const areBoardMoveAndGameMoveTheSame = areMovesTheSame(
			boardMoveForCurrentMoveNumber,
			gameMoveForCurrentMoveNumber,
		);

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

	let sgf = getSgfOfTheDay();
</script>

<style lang="scss">
	.info-area {
		height: 100px;
	}
</style>
