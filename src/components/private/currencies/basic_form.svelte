<script lang="ts">
	import type { GeneralError } from "+/rest"

	import Flex from "$/layout/flex.svelte"
	import TextField from "$/form/text_field.svelte"

	export let IDPrefix: string
	export let code: string
	export let name: string
	export let isConnecting: boolean
	export let errors: GeneralError[]
	export let id: string|null = null
</script>

<form class="mdc-card" {id} on:submit>
	<div class="mdc-card__content">
		<Flex>
			<TextField
				fieldName="Code"
				disabled={isConnecting}
				bind:value={code}
				{IDPrefix}
				{errors}/>
			<TextField
				fieldName="Name"
				disabled={isConnecting}
				bind:value={name}
				{IDPrefix}
				{errors}/>
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
