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
		{initialMoveNumber}
		isInteractive={isUsersTurn && $currentMoveNumber < $gameBranch?.length && !hasError}
		isNavigable={false}
		bind:boardBranch
		overwriteBoardStateHistory={false}
		turn={inverseColors ? "W" : "B"}
		{inverseColors}
		{axisToFlipBoard}
		{boardRotationAngle}
		autoSize
		on:moveMade={handleMoveMade}
	/>
{/key}

<script lang="ts">
	import { Board, goToNextMove, goToPreviousMove, gameBranch, currentMoveNumber } from "ko-sgf";
	import type { GameBranch, GameNode } from "ko-sgf/dist/types/game-tree";
	import type { BoardState } from "ko-sgf/dist/types/board-state";
	import { getSgfOfTheDay } from "@/helpers/sgf";

	// TODO shouldn't be binding these lol
	let boardBranch: GameBranch = $gameBranch?.slice(0, 2);

	let hasError = false;
	let success = false;
	let rerender = 0;
	let moveNumberToPlay = $currentMoveNumber + 1;

	let inverseColors = false;
	let axisToFlipBoard: "x" | "y" | "xy" | "positive" | "negative" | null = null;
	let boardRotationAngle: 0 | 90 | 180 | 270 = 0;

	let isWaitingOnChange = false;

	let boardState: BoardState = {};

	let usersColor = Math.random() > 0.5 ? "B" : "W";
	let initialMoveNumber = usersColor === "B" ? 2 : 1;
	let isUsersTurn =
		usersColor === "B" ? $currentMoveNumber % 2 === 0 : $currentMoveNumber % 2 === 1;
	if (inverseColors) {
		initialMoveNumber++;
		isUsersTurn = !isUsersTurn;
	}

	console.log({ isUsersTurn, $currentMoveNumber });

	const handleReset = async (randomize = false) => {
		// if (randomize) {
		// 	const axisOptions = ["x", "y", "xy", "positive", "negative", null];
		// 	const boardRotationAngleOptions = [0, 90, 180, 270];
		// 	inverseColors = Math.random() > 0.5;
		// 	axisToFlipBoard = axisOptions[Math.floor(Math.random() * axisOptions.length)] as
		// 		| "x"
		// 		| "y"
		// 		| "xy"
		// 		| "positive"
		// 		| "negative"
		// 		| null;
		// 	boardRotationAngle = boardRotationAngleOptions[Math.floor(Math.random() * 4)] as
		// 		| 0
		// 		| 90
		// 		| 180
		// 		| 270;
		// }
		// hasError = false;
		// success = false;
		// rerender++;
		// currentMoveNumber = 2;
	};

	$: {
		isUsersTurn = inverseColors
			? usersColor === "B"
				? $currentMoveNumber % 2 === 1
				: $currentMoveNumber % 2 === 0
			: usersColor === "B"
			? $currentMoveNumber % 2 === 0
			: $currentMoveNumber % 2 === 1;
	}

	const handleMoveMade = (event: CustomEvent) => {
		const { move } = event.detail;

		if (move && move.number <= $gameBranch.length) {
			const correctMove = $gameBranch[move.number - 1];
			const didUserPlayCorrectMove = areMovesTheSame(move, correctMove);

			if (move.number === $gameBranch.length && didUserPlayCorrectMove) {
				success = true;
			} else if (move.number < $gameBranch.length) {
				if (!isWaitingOnChange) {
					isWaitingOnChange = true;
					hasError = !didUserPlayCorrectMove;

					setTimeout(() => {
						if (didUserPlayCorrectMove) {
							goToNextMove();
						} else {
							goToPreviousMove();
						}

						isWaitingOnChange = false;
						hasError = false;
					}, 500);
				}
			}
		}
	};

	// const getIsUsersTurn = (usersColor: "B" | "W" | "Both", moveNumberToPlay: number) => {
	// 	return usersColor === "Both"
	// 		? true
	// 		: usersColor === "B"
	// 		? moveNumberToPlay % 2 === 1
	// 		: moveNumberToPlay % 2 === 0;
	// };

	// $: {
	// 	const boardMoveForCurrentMoveNumber = boardBranch[currentMoveNumber - 1];
	// 	const gameMoveForCurrentMoveNumber = $gameBranch[currentMoveNumber - 1];

	// 	const areBoardMoveAndGameMoveTheSame = areMovesTheSame(
	// 		boardMoveForCurrentMoveNumber,
	// 		gameMoveForCurrentMoveNumber,
	// 	);

	// 	// if they're not the same, check if it's the same as when the move is flipped across diagonal lines

	// 	hasError =
	// 		currentMoveNumber > $gameBranch.length ||
	// 		(boardMoveForCurrentMoveNumber &&
	// 			gameMoveForCurrentMoveNumber &&
	// 			!areBoardMoveAndGameMoveTheSame);

	// 	if (currentMoveNumber === $gameBranch.length && $gameBranch.length > 0) {
	// 		success = areBoardMoveAndGameMoveTheSame;
	// 	}
	// }

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
