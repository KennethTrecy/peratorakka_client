<script lang="ts">
import type { GeneralError } from "+/rest"

import { isSimpleError } from "+/rest"

import Flex from "$/layout/flex.svelte"
import ReactiveProgressBar from "$/utility/reactive_progress_bar.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"
import TextContainer from "$/typography/text_container.svelte"

export let errors: GeneralError[]
export let id: string|null
export let isConnecting: boolean

$: progressBarLabel = isConnecting
	? "Waiting for server's response..."
	: (
		errors.length > 0
		? "Failed to submit the details. Please check the errors."
		: "Enter valid details only and submit the form."
	)
$: simpleErrors = errors.filter(isSimpleError).map(error => error.message).join(" ")
$: hasSimpleErrors = simpleErrors.length > 0
</script>

<form class="card" {id} on:submit|preventDefault>
	<ReactiveProgressBar {progressBarLabel} isLoading={isConnecting}/>
	<div class="card-content">
		{#if $$slots.lead_content}
			<slot name="lead_content"/>
		{/if}
		{#if hasSimpleErrors}
			<Flex justifyContent="start">
				<TextContainer>
					<ShortParagraph>
						{simpleErrors}
					</ShortParagraph>
				</TextContainer>
			</Flex>
		{/if}
		<slot name="field_content"/>
	</div>
	<div class="card-action">
		<slot name="action_buttons"/>
	</div>
</form>

<style lang="scss">
@use "@/components/third-party/index";
</style>
