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

<div class="list middle-align center-align grid">
	<div class="s1 m2 l3"></div>
	<div class="s10 m8 l6">
		<div class="fill medium-height middle-align center-align">
			<div class="center-align medium-padding">
				<i class="extra">cloud_off</i>
				<h1>You are not yet connected to any server</h1>
				<p>Choose or enter a server you want to connect</p>
				<div class="space"></div>
				<form class="no-space center-align">
					<div class="field label suffix small">
						<select id="server_choices" class="active" bind:value={selectedServer}>
							{#each serverChoices as { URL, name }(URL)}
								<option value={URL}>
									{name}
								</option>
							{/each}
							<option value={CUSTOM_KEY}>Custom</option>
						</select>
						<label for="server_choices" class="active">Servers</label>
						<i>arrow_drop_down</i>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	@use "@/components/third-party/index";

	div.list {
		width: 100%;
		height: 100%;
	}

	h1 {
		@extend h5;
	}

	form {
		@extend nav;
	}
</style>
