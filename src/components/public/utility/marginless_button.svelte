<script lang="ts">
	export let kind: "submit"|"button" = "button"
	export let disabled: boolean = false
</script>

<button type={kind} disabled={disabled}>
	<slot></slot>
</button>

<style lang="scss">
	@use "@/components/third-party/index";

	button {
		margin: 0em;
	}
</style>
