<script lang="ts">
	import { PUBLIC_PRODUCTION_SERVER_CHOICES } from "$env/static/public"

	const CUSTOM_KEY = "custom"

	const rawServerChoices: string[] = PUBLIC_PRODUCTION_SERVER_CHOICES.split(",")
	const domainNameRegex = /https?:\/\/(.+)/
	const serverChoices = rawServerChoices.map(rawServer => ({
		"URL": rawServer,
		"name": (domainNameRegex.exec(rawServer) ?? [ null, rawServer ])[1]
	}))
	let selectedServer = ""
</script>

<form>
	<div class="field label suffix small">
		<select id="server_choices" class="active" bind:value={selectedServer}>
			{#each serverChoices as { URL, name }(URL)}
				<option value={URL}>
					{name}
				</option>
			{/each}
			<option value={CUSTOM_KEY}>Custom</option>
		</select>
		<label for="server_choices" class="active">Label</label>
		<i>arrow_drop_down</i>
	</div>
</form>

<style lang="scss">
	@use "@/components/third-party/index";
</style>
