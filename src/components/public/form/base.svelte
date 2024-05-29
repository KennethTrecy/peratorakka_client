<script lang="ts">
	import type { GeneralError } from "+/rest"

	import { isSimpleError } from "+/rest"

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

<form class="mdc-card" {id} on:submit|preventDefault>
	<ReactiveProgressBar
		isLoading={isConnecting}
		{progressBarLabel}/>
	{#if $$slots.lead_content}
		<div class="mdc-card__content">
			<slot name="lead_content"/>
		</div>
	{/if}
	{#if hasSimpleErrors}
		<div class="mdc-card__content">
			<TextContainer>
				<ShortParagraph>
					{simpleErrors}
				</ShortParagraph>
			</TextContainer>
		</div>
	{/if}
	<div class="mdc-card__content">
		<slot name="field_content"/>
	</div>
	<div class="mdc-card__actions">
		<div class="mdc-card__action-buttons">
			<slot name="action_buttons"/>
		</div>
	</div>
</form>

<style lang="scss">
	@use "@/components/third-party/index";

	@use "@material/card";

	@include card.core-styles;
</style>
