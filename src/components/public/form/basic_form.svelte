<script lang="ts">
	import type { GeneralError } from "+/rest"

	import Flex from "$/layout/flex.svelte"
	import FormBase from "$/form/base.svelte"

	export let errors: GeneralError[]
	export let id: string|null
	export let isConnecting: boolean
</script>

<FormBase {isConnecting} {id} {errors} on:submit>
	<Flex slot="field_content" justifyContent="stretch" mustPad={false}>
		<slot name="fields"/>
	</Flex>
	<slot slot="action_buttons" name="button_group"/>
</FormBase>
