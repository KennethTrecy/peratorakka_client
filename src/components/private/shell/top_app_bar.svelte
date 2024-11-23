<script lang="ts">
import AppName from "%/shell/top_app_bar/app_name.svelte"
import NavigationButton from "%/shell/top_app_bar/navigation_button.svelte"
import NavigationListCollection from "%/shell/navigation_list_collection.svelte"

export let isMenuShown: boolean

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
			on:click={toggleMenu}/>
		<ul class="right hide-on-med-and-down">
			<NavigationListCollection bind:isMenuShown={isMenuShown}/>
		</ul>
	</div>
</nav>

<style lang="scss">
@use "@/components/third-party/index";

ul {
	display: flex;
	flex-flow: row nowrap;

	> :global(li:nth-child(2)) {
		order: 1;
	}

	> :global(li:nth-child(3)) {
		order: 1;
	}
}
</style>
