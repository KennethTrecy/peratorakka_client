<script lang="ts">
import AppName from "%/shell/top_app_bar/app_name.svelte"
import NavigationButton from "%/shell/top_app_bar/navigation_button.svelte"
import NavigationListCollection from "%/shell/navigation_list_collection.svelte"

let { isMenuShown = $bindable() }: {
	isMenuShown: boolean
} = $props()

function toggleMenu() {
	isMenuShown = !isMenuShown
}
</script>

<nav>
	<div class="nav-wrapper">
		<AppName/>
		<NavigationButton
			label="Open navigation menu"
			icon="menu"
			onclick={toggleMenu}/>
		<ul class="right hide-on-med-and-down">
			<NavigationListCollection bind:isMenuShown={isMenuShown}/>
		</ul>
	</div>
</nav>

<style lang="scss">
ul {
	display: flex;
	flex-flow: row nowrap;

	> :global(li:nth-child(3)) {
		order: 1;
	}
}

@media only screen and (min-width: 993px) and (max-width: 1599px) {
	nav {
		height: calc(var(--navbar-height) * 2);

		> .nav-wrapper > ul {
			margin-top: var(--navbar-height);
			padding-left: 0px;
			justify-content: stretch;
			width: 100%;
			height: 50%;
		}
	}
}
</style>
