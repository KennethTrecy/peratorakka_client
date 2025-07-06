<script lang="ts">
import type { Snippet } from "svelte"
import type { GeneralError } from "+/rest"

import Flex from "$/layout/flex.svelte"
import FormBase from "$/form/base.svelte"
import TextCardButton from "$/button/card/text.svelte"

let {
	errors,
	id,
	isConnecting,
	actionLabel,
	onsubmit,
	text_description,
	fields
}: {
	errors: GeneralError[]
	id: string|null
	isConnecting: boolean
	actionLabel: string
	onsubmit: (event: SubmitEvent) => void
	text_description?: Snippet
	fields: Snippet
} = $props()
</script>

<div class="card_form">
	<FormBase {id} {isConnecting} {errors} {onsubmit}>
		{#snippet lead_content()}
			{@render text_description?.()}
		{/snippet}
		{#snippet field_content()}
			<Flex mustPad={false} justifyContent="stretch">
				{@render fields?.()}
			</Flex>
		{/snippet}
		{#snippet action_buttons()}
			<TextCardButton
				kind="submit"
				disabled={isConnecting}
				label={actionLabel}/>
		{/snippet}
	</FormBase>
</div>
