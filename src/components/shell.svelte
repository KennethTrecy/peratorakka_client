<script lang="ts">
	import { onMount } from "svelte"

	onMount(() => {
		// @ts-ignore
		window.ui("theme", "/logo.png")
	})
</script>

<svelte:head>
	<style>
		* {
			box-sizing: border-box;
			padding: 0em;
			border: 0em;
			margin: 0em;
		}
	</style>
</svelte:head>

<div class="shell">
	<header class="primary-container">
		<nav>
			<button class="circle transparent">
				<i>menu</i>
			</button>
			<p class="max center-align">Peratorakka</p>
			<button class="circle transparent">
				<img class="responsive" src="logo.png" alt="Peratorakka logo"/>
			</button>
		</nav>
	</header>
	<main>
		<slot name="main"></slot>
	</main>
	<footer class="responsive max primary medium-line">
		<p class="small-text">
			Copyright © 2023 by Kenneth Trecy Tobias.
		</p>
	</footer>
</div>

<style lang="scss">
	@use "@/components/third-party/index";

	.shell {
		width: 100%;
		height: 100%;

		display: flex;
		flex-flow: column nowrap;

		> main {
			flex: 1;
		}
	}

	p {
		@extend h5
	}

	footer {
		padding: 1rem;
	}
</style>
