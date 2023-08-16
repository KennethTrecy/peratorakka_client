<script lang="ts">
	export let label: string
	export let icon: string
</script>

<button
	class="mdc-top-app-bar__navigation-icon mdc-icon-button"
	aria-label={label}
	on:click>
	<i>{icon}</i>
</button>

<style lang="scss">
	@use "@/components/third-party/index";

	@use "@material/icon-button/styles";
	@use "@material/top-app-bar/mdc-top-app-bar";
</style>
