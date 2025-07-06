<script lang="ts">
import TextCardButton from "$/button/card/text.svelte"

let { disabled, cancelEdit }: {
	disabled: boolean
	cancelEdit: () => void
} = $props()
</script>

<TextCardButton
	kind="submit"
	{disabled}
	label="Save"/>
<TextCardButton
	kind="button"
	{disabled}
	label="Cancel"
	onclick={cancelEdit}/>
