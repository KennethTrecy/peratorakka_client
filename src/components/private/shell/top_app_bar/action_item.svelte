<script lang="ts">
	import IconButton from "$/button/icon.svelte"

	export let label: string
	export let icon: string
</script>

<IconButton
	class="top_bar__action_item"
	{label}
	{icon}
	on:click/>

<style lang="scss">
	@use "@/components/third-party/new_index";

	@use "@material/top-app-bar/mdc-top-app-bar";

	:global(.top_bar__action_item) {
		@extend .mdc-top-app-bar__action-item;
	}
</style>
