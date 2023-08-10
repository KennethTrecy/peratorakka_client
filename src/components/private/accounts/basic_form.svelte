<script lang="ts">
	import type { GeneralError } from "+/rest"

	import TextField from "$/form/text_field.svelte"

	export let IDPrefix: string
	export let code: string
	export let name: string
	export let isConnecting: boolean
	export let errors: GeneralError[]
	export let id = ""
</script>

<form class="s12 m12 l12 grid large-space" {id} on:submit>
	<fieldset class="s12 m12 l12 grid large-space">
		<div class="s12 m12 l12">
			<TextField
				fieldName="Code"
				disabled={isConnecting}
				bind:value={code}
				{IDPrefix}
				{errors}/>
		</div>
		<div class="s12 m12 l12">
			<TextField
				fieldName="Name"
				disabled={isConnecting}
				bind:value={name}
				{IDPrefix}
				{errors}/>
		</div>
	</fieldset>
	<div class="s12 m12 l12">
		<slot name="buttonGroup"/>
	</div>
</form>


<style lang="scss">
	@use "@/components/third-party/index";
</style>
