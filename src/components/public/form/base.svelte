<script lang="ts">
import type { Snippet } from "svelte"
import type { GeneralError } from "+/rest"

import { isSimpleError } from "+/rest"

import Flex from "$/layout/flex.svelte"
import ReactiveProgressBar from "$/utility/reactive_progress_bar.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"

let {
	errors,
	id,
	isConnecting,
	onsubmit,
	lead_content,
	field_content,
	action_buttons
}: {
	errors: GeneralError[]
	id: string|null
	isConnecting: boolean
	onsubmit: (event: SubmitEvent) => void
	lead_content?: Snippet
	field_content: Snippet
	action_buttons: Snippet
} = $props()

let progressBarLabel = $derived(
	isConnecting
		? "Waiting for server's response..."
		: (
			errors.length > 0
			? "Failed to submit the details. Please check the errors."
			: "Enter valid details only and submit the form."
		)
)
let simpleErrors = $derived(errors.filter(isSimpleError).map(error => error.message).join(" "))
let hasSimpleErrors = $derived(simpleErrors.length > 0)

function submit(event: SubmitEvent) {
	event.preventDefault()
	onsubmit(event)
}
</script>

<form class="card" {id} onsubmit={submit}>
	<ReactiveProgressBar {progressBarLabel} isLoading={isConnecting}/>
	<div class="card-content">
		{@render lead_content?.()}
		{@render field_content()}
		{#if hasSimpleErrors}
			<Flex justifyContent="start" mustPad={false}>
				<ShortParagraph>
					{simpleErrors}
				</ShortParagraph>
			</Flex>
		{/if}
	</div>
	<div class="card-action">
		{@render action_buttons()}
	</div>
</form>
