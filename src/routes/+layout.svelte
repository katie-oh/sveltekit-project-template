<div class="background" />

<nav>
	<a href="/">today's opening</a>
	<a href="/practice">practice</a>
	<a href="/playground">playground</a>
</nav>

<div class="main-container">
	<slot />
</div>

<style lang="scss">
	.background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: linear-gradient(to top right, lightblue, lightcyan);
		background-size: cover;
		background-position: center;
		filter: blur(5px);
		z-index: -1;
	}

	nav {
		padding: 1rem;
		display: flex;
		gap: 2rem;
	}
	.main-container {
		padding: 0 1rem 1rem;
		max-width: 600px;
		width: max-content;
		margin: auto;
	}
</style>
