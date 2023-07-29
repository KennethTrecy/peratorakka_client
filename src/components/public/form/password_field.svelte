<script lang="ts">
	export let fieldName: string
	export let disabled: boolean
	export let value: string

	$: fieldID = fieldName.replace(" ", "_").toLocaleLowerCase()
	$: isActive = Boolean(value)
	$: activeClass = isActive ? "active" : ""
</script>

<div class="field label border">
	<input
		class={activeClass}
		type="password"
		bind:value={value}
		id={fieldID}
		disabled={disabled}>
	<label class={activeClass} for={fieldID}>{fieldName}</label>
</div>

<style lang="scss">
	@use "@/components/third-party/index";
</style>
