<script lang="ts">
	import TextField from "$/form/text_field.svelte"

	let isConnecting = false
	let code = ""
	let name = ""
</script>

<section>
	<h2>Add Currency</h2>
	<p>
		Currencies are used as symbols for different financial entries and other parts of the
		application. You have a freedom to add currencies, regardless whether they are physical or
		crypto.
	</p>
	<p>
		The limitation is that the application tracks the currency conversions through previous
		financial entries. Therefore, there is no network usage to check for current conversions which
		is a beneficial effect.
	</p>
	<form on:submit>
		<fieldset>
			<TextField
				fieldName="Code of New Currency"
				disabled={isConnecting}
				bind:value={code}/>
			<TextField
				fieldName="Name of New Currency"
				disabled={isConnecting}
				bind:value={name}/>
		</fieldset>
		<button type="submit" disabled={isConnecting}>
			Add
		</button>
	</form>
</section>

<style lang="scss">
	@use "@/components/third-party/index";
</style>
