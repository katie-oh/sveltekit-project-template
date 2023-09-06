<div class="root-layout">
	<div class="background" />

	<nav>
		<div class="link-container">
			<a href="/">today's opening</a>
			<a href="/practice">practice</a>
			<a href="/playground">playground</a>
		</div>

		<div class="link-container">
			<a href="/about">about</a>
		</div>
	</nav>

	<div class="main-container">
		<slot />
	</div>
</div>

<style lang="scss">
	.root-layout {
		padding: 1rem;
		margin: auto;
		width: max-content;

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
			display: flex;
			justify-content: space-between;
			width: 100%;
			padding-bottom: 1rem;

			.link-container {
				display: flex;
				gap: 2rem;
			}
		}

		.main-container {
			max-width: $max-page-width;
		}
	}
</style>
