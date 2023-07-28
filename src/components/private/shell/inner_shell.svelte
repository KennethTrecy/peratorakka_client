<script lang="ts">
	import { createEventDispatcher } from "svelte"

	import { menuItemInfos } from "%/shell/state"

	import AppName from "%/shell/app_name.svelte"

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
	{#each $menuItemInfos as info, index(info.link)}
		<a href={info.link}>
			<i>{info.icon}</i>
			<span>{info.label}</span>
		</a>
	{/each}
</dialog>
<nav class="m l left">
	<a href="/">
		<img class="responsive" src="logo.png" alt="Peratorakka logo"/>
	</a>
	{#each $menuItemInfos as info(info.link)}
		<a href={info.link}>
			<i>{info.icon}</i>
			<span>{info.label}</span>
		</a>
	{/each}
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

	header.fixed {
		padding: 0.5em 0em 0em;
	}
</style>
