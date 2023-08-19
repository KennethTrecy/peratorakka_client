<script lang="ts">
	import { createEventDispatcher } from "svelte"

	import TextCardButton from "$/button/card/text.svelte"

	export let disabled: boolean

	const dispatch = createEventDispatcher<{
		"cancelEdit": void
	}>()

	function cancelEdit() {
		dispatch("cancelEdit")
	}
</script>

<TextCardButton
	kind="submit"
	{disabled}
	label="Save"/>
<TextCardButton
	kind="button"
	{disabled}
	label="Cancel"
	on:click={cancelEdit}/>
