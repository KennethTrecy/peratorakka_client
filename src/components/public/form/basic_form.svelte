<script lang="ts">
import type { Snippet } from "svelte"
import type { GeneralError } from "+/rest"

import Flex from "$/layout/flex.svelte"
import FormBase from "$/form/base.svelte"

let {
	errors,
	id,
	isConnecting,
	onsubmit,
	fields,
	button_group
}: {
	errors: GeneralError[]
	id: string|null
	isConnecting: boolean
	onsubmit: (event: SubmitEvent) => void
	fields: Snippet
	button_group: Snippet
} = $props()
</script>

<FormBase {isConnecting} {id} {errors} {onsubmit} action_buttons={button_group}>
	{#snippet field_content()}
		<Flex justifyContent="stretch" mustPad={false}>
			{@render fields()}
		</Flex>
	{/snippet}
</FormBase>
