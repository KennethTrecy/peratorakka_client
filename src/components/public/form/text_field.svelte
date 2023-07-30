<script lang="ts">
	export let fieldName: string
	export let disabled: boolean
	export let value: string
	export let IDPrefix: string = ""

	$: fieldID = (
		IDPrefix === ""
			? ""
			: `${IDPrefix}_`
	) + fieldName.replace(" ", "_").toLocaleLowerCase()
	$: isActive = Boolean(value)
	$: activeClass = isActive ? "active" : ""
</script>

<div class="field label border">
	<input
		class={activeClass}
		type="text"
		bind:value={value}
		id={fieldID}
		disabled={disabled}>
	<label class={activeClass} for={fieldID}>{fieldName}</label>
</div>

<style lang="scss">
	@use "@/components/third-party/index";
</style>
