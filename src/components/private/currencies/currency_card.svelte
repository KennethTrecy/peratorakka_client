<script lang="ts">
	import type { GeneralError } from "+/rest"
	import type { Entity } from "%/currencies/types"

	import TextField from "$/form/text_field.svelte"

	export let data: Entity

	let edit = false
	let code = data.code
	let name = data.name
	let isConnecting = false
	let errors: GeneralError[] = []

	$: IDPrefix = `old_currency_${data.id}`
	$: formID = `${IDPrefix}_form`

	function startEditing() {
		edit = true
	}

	function stopEditing() {
		edit = false
	}

	function confirmEdit(event: SubmitEvent) {
		event.preventDefault()
		stopEditing()
	}

	function cancelEdit() {
		stopEditing()
		code = data.code
		name = data.name
	}
</script>

<article class="secondary-container">
	{#if edit}
		<form id={formID} on:submit={confirmEdit}>
			<fieldset>
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
			</fieldset>
		</form>
	{:else}
		<h3>{data.code}</h3>
		<p>{data.name}</p>
	{/if}

	<div class="nav">
		{#if edit}
			<button type="submit" form={formID} disabled={isConnecting}>
				<i>save</i>
			</button>
			<button on:click={cancelEdit} type="button" form={formID}  disabled={isConnecting}>
				<i>cancel</i>
			</button>
		{:else}
			<button on:click={startEditing}>
				<i>edit</i>
			</button>
			<button>
				<i>delete</i>
			</button>
		{/if}
	</div>
</article>


<style lang="scss">
	@use "@/components/third-party/index";

	h3 {
		@extend h5;
	}

	div.nav {
		@extend nav;
	}
</style>
