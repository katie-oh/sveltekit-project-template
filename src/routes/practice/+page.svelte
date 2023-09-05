<div class="info-area">
	You are {usersColor}
	{#if success}
		<p>Success!</p>
		<button on:click={handleReset}>Keep practicing!</button>
	{/if}
</div>

{#key rerender}
	<div class="board-container">
		<Board
			{sgf}
			{initialMoveNumber}
			isInteractive={isUsersTurn && $currentMoveNumber < $gameBranch?.length && !hasError}
			isNavigable={false}
			bind:boardBranch
			overwriteBoardStateHistory={false}
			turn={turnColor}
			{inverseColors}
			{axisToFlipBoard}
			{boardRotationAngle}
			autoSize
			on:moveMade={handleMoveMade}
		/>

		{#if hasError}
			<div class="x" />
		{/if}
	</div>
{/key}

<script lang="ts">
	import { Board, goToNextMove, goToPreviousMove, gameBranch, currentMoveNumber } from "ko-sgf";
	import type { GameBranch, GameNode } from "ko-sgf/dist/types/game-tree";
	import type { BoardState } from "ko-sgf/dist/types/board-state";
	import { getSgfOfTheDay } from "@/helpers/sgf";
	import { onMount } from "svelte";

	// TODO shouldn't be binding this lol
	let boardBranch: GameBranch = $gameBranch?.slice(0, 2);

	let hasError = false;
	let success = false;
	let rerender = 0;

	let inverseColors = false;
	let axisToFlipBoard: "x" | "y" | "xy" | "positive" | "negative" | null = null;
	let boardRotationAngle: 0 | 90 | 180 | 270 = 0;

	let isWaitingOnChange = false;

	let boardState: BoardState = {};

	let usersColor: "B" | "W" = "B";
	let initialMoveNumber: number;
	let isUsersTurn = true;

	let turnColor: "B" | "W" = "B";

	onMount(() => {
		handleReset();
	});

	const handleReset = () => {
		usersColor = Math.random() > 0.5 ? "B" : "W";
		initialMoveNumber = usersColor === "B" ? 2 : 1;
		isUsersTurn = usersColor === "B" ? initialMoveNumber % 2 === 0 : initialMoveNumber % 2 === 1;
		inverseColors = Math.random() > 0.5;
		if (inverseColors) {
			initialMoveNumber++;
			isUsersTurn = !isUsersTurn;
		}

		const axisOptions = ["x", "y", "xy", "positive", "negative", null];
		const boardRotationAngleOptions = [0, 90, 180, 270];
		axisToFlipBoard = axisOptions[Math.floor(Math.random() * axisOptions.length)] as
			| "x"
			| "y"
			| "xy"
			| "positive"
			| "negative"
			| null;
		boardRotationAngle = boardRotationAngleOptions[Math.floor(Math.random() * 4)] as
			| 0
			| 90
			| 180
			| 270;

		hasError = false;
		success = false;
		rerender++;
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

	$: {
		turnColor = ($currentMoveNumber + 1) % 2 === 1 ? "B" : "W";
		if (inverseColors) {
			turnColor = turnColor === "B" ? "W" : "B";
		}
	}

	const handleMoveMade = (event: CustomEvent) => {
		const { move } = event.detail;
		
		if (move && move.number <= $gameBranch.length && !success) {
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

	.board-container {
		position: relative;
		width: fit-content;
		height: fit-content;

		@keyframes flash {
			0% {
				opacity: 80%;
			}
			10% {
				opacity: 0%;
			}
			50% {
				opacity: 80%;
			}
			100% {
				opacity: 0%;
			}
		}

		.x {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 100%;
			height: 500px;
			animation: flash 0.25s;
			z-index: 99;

			&:before,
			&:after {
				border-radius: 1rem;
				position: absolute;
				left: 50%;
				content: " ";
				height: 500px;
				width: 1rem;
				background-color: red;
			}

			&:before {
				transform: rotate(45deg);
			}

			&:after {
				transform: rotate(-45deg);
			}
		}
	}
</style>
