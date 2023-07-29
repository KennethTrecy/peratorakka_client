<script lang="ts">
	export let fieldName: string
	export let disabled: boolean
	export let value: string

	$: fieldID = fieldName.toLocaleLowerCase()
</script>

<div class="field label border">
	<input type="text" bind:value={value} id={fieldID} disabled={disabled}>
	<label for={fieldID}>{fieldName}</label>
</div>

<style lang="scss">
	@use "@/components/third-party/index";
</style>
