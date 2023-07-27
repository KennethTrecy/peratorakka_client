<script lang="ts">
	import { createEventDispatcher } from "svelte"

	import AppName from "@/components/shell/app_name.svelte"
	import MenuItem from "@/components/shell/menu_item.svelte"

	export let isMenuShown: boolean
	const dispatch = createEventDispatcher<{
		toggleMenu: never
	}>()

	const basicDialogClasses = [ "left", "secondary-container" ]
	$: resolvedDialogClasses = (
		isMenuShown
			? [ ...basicDialogClasses, "active" ]
			: [ ...basicDialogClasses ]
	).join(" ")

	function toggleMenu() {
		dispatch("toggleMenu", null as never)
	}
</script>

<dialog class={resolvedDialogClasses}>
	<header class="fixed">
		<nav>
			<button class="transparent circle large" on:click={toggleMenu}>
				<i>close</i>
			</button>
			<p class="max">
				<AppName shouldCenterAlign={false}/>
			</p>
		</nav>
	</header>
	<a href="" class="row round">
		<i>cloud_off</i>
		<span>Server</span>
	</a>
</dialog>
<nav class="m l left">
	<a href="/">
		<img class="responsive" src="logo.png" alt="Peratorakka logo"/>
	</a>
	<a href="">
		<i>cloud_off</i>
		<span>Server</span>
	</a>
</nav>
<main class="responsive">
	<slot></slot>
</main>
<footer class="responsive max primary medium-line">
	<p class="small-text">
		Copyright © 2023 by Kenneth Trecy Tobias.
	</p>
</footer>

<style lang="scss">
	@use "@/components/third-party/index";

	header {
		padding-top: 1em;
	}
</style>
