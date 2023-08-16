<script lang="ts">
	import IconButton from "$/utility/button/icon.svelte"

	export let label: string
	export let icon: string
</script>

<IconButton
	class="mdc-top-app-bar__navigation-icon"
	{label}
	{icon}
	on:click/>

<style lang="scss">
	@use "@/components/third-party/new_index";

	@use "@material/top-app-bar/mdc-top-app-bar";
</style>
