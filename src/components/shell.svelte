<script lang="ts">
	import { onMount } from "svelte"

	onMount(() => {
		// @ts-ignore
		window.ui("theme", "/logo.png")
	})

	let isMenuShown = false
	const basicDialogClasses = [ "left", "secondary-container" ]
	$: resolvedDialogClasses = (
		isMenuShown
			? [ ...basicDialogClasses, "active" ]
			: [ ...basicDialogClasses ]
	).join(" ")

	function toggleMenu() {
		isMenuShown = !isMenuShown
	}
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
			<button class="circle transparent" on:click={toggleMenu}>
				<i>menu</i>
			</button>
			<p class="max center-align">Peratorakka</p>
			<button class="circle transparent">
				<img class="responsive" src="logo.png" alt="Peratorakka logo"/>
			</button>
		</nav>
	</header>
	<dialog class={resolvedDialogClasses}>
		<header class="fixed">
			<nav>
				<button class="transparent circle large" on:click={toggleMenu}>
					<i>close</i>
				</button>
				<p class="max">Peratorakka</p>
			</nav>
		</header>
		<a href="" class="row round">
			<i>cloud_off</i>
			<span>Server</span>
			<div class="max"></div>
			<i>priority_high</i>
		</a>
	</dialog>
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
