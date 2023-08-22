export const getSgfOfTheDay = () => {
	const sgfs = {
		"2023-08-12":
			"(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[19]DT[2023-08-22];B[pd];W[qf];B[nc];W[rd];B[qc];W[qi])",
		"2023-08-13":
			"(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[19]DT[2023-08-22];B[pd];W[qf];B[nc];W[qd];B[qc];W[rc];B[qe];W[rd];B[pe];W[re];B[pf];W[qg])",
		"2023-08-14":
			"(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[19]DT[2023-08-22];B[pd];W[qf];B[nc];W[qd];B[qc];W[rc];B[qe];W[rd];B[pe];W[re];B[pf];W[qg])",
		"2023-08-15":
			"(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[19]DT[2023-08-22];B[pd];W[qf];B[nc];W[qd];B[qc];W[rc];B[qe];W[rd];B[pe];W[re];B[pf];W[qg])",
		"2023-08-16":
			"(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[19]DT[2023-08-22];B[pd];W[qf];B[nc];W[qd];B[qc];W[rc];B[qe];W[rd];B[pe];W[re];B[pf];W[qg])",
	};

	const today = new Date().toISOString().split("T")[0];
	const dates = Object.keys(sgfs);

	return dates.includes(today)
		? sgfs[today as keyof typeof sgfs]
		: sgfs[dates[parseInt(today.replaceAll("-", "")) % dates.length] as keyof typeof sgfs];
};