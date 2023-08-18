<!-- <h1>Go opening of the day</h1>

<div>Here's where the SGF would go</div>

SGF -->

<Board {sgf} />

<script lang="ts">
	import { Board } from "ko-sgf";

	const mainBranchTest =
		"(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[19]DT[2023-08-18];B[dd];W[cd];B[dc](;W[de])(;W[cc]))";

	const sgf = mainBranchTest;
</script>
