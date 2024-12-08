<script lang="ts">
import type { GeneralError } from "+/rest"

import Flex from "$/layout/flex.svelte"
import FormBase from "$/form/base.svelte"
import TextCardButton from "$/button/card/text.svelte"
import TextContainer from "$/typography/text_container.svelte"

export let errors: GeneralError[]
export let id: string|null
export let isConnecting: boolean
export let actionLabel: string
</script>

<div class="card_form">
	<FormBase {id} {isConnecting} {errors} on:submit>
		<svelte:fragment slot="lead_content">
			<slot name="text_description"/>
		</svelte:fragment>
		<Flex slot="field_content" mustPad={false} justifyContent="stretch">
			<slot name="fields"/>
		</Flex>
		<svelte:fragment slot="action_buttons">
			<TextCardButton
				kind="submit"
				disabled={isConnecting}
				label={actionLabel}/>
		</svelte:fragment>
	</FormBase>
</div>

<style lang="scss">
@use "@/components/third-party/index";
</style>
