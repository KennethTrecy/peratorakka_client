<script lang="ts">
	import type { GeneralError } from "+/rest"

	import Flex from "$/layout/flex.svelte"
	import IndeterminateProgressBar from "$/utility/indeterminate_progress_bar.svelte"

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
</script>

<form class="mdc-card" {id} on:submit>
	<IndeterminateProgressBar
		isLoading={isConnecting}
		{progressBarLabel}/>
	<div class="mdc-card__content">
		<Flex>
			<slot name="fields"/>
		</Flex>
	</div>
	<div class="mdc-card__actions">
		<div class="mdc-card__action-buttons">
			<slot name="button_group"/>
		</div>
	</div>
</form>

<style lang="scss">
	@use "@/components/third-party/new_index";

	@use "@material/card";

	@include card.core-styles;
</style>
