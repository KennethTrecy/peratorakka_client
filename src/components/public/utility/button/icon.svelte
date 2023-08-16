<script lang="ts">
	export let label: string
	export let icon: string
	let otherClasses: string

	export { otherClasses as class }

	$: buttonClasses = [
		"mdc-icon-button",
		...otherClasses.split(" ")
	].filter(Boolean).join(" ")
</script>

<button
	class={buttonClasses}
	aria-label={label}
	on:click>
	<i>{icon}</i>
</button>

<style lang="scss">
	@use "@/components/third-party/new_index";

	@use "@material/icon-button/styles";
</style>
