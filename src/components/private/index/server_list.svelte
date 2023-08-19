<script lang="ts">
	import type { ChoiceInfo } from "+/component"

	import { PUBLIC_PRODUCTION_SERVER_CHOICES } from "$env/static/public"

	import { serverURL, CSRFToken, hasServer, hasToken, serverIcon } from "$/global_state"

	import ServerDisplay from "$/utility/server_display.svelte"
	import SingleForm from "$/form/single_form.svelte"
	import TextCardButton from "$/button/card/text.svelte"
	import TextField from "$/form/text_field.svelte"
	import ChoiceListField from "$/form/choice_list_field.svelte"

	const CUSTOM_KEY = "custom"

	const rawServerChoices: string[] = PUBLIC_PRODUCTION_SERVER_CHOICES.split(",")
	let selectedServer = rawServerChoices[0] ?? CUSTOM_KEY
	let customServer = ""
	$: mustBeCustomServer = selectedServer === CUSTOM_KEY
	$: resolvedSelectedServer = mustBeCustomServer
	? customServer
		: selectedServer
	$: serverChoices = [
		...rawServerChoices,
		CUSTOM_KEY
	]
	const domainNameRegex = /https?:\/\/(.+)/
	function transformServer(server: string): ChoiceInfo {
		let label = "Custom"
		let data = CUSTOM_KEY
		if (server !== CUSTOM_KEY) {
			label = (domainNameRegex.exec(server) ?? [ null, server ])[1]
			data = server
		}

		return { label, data }
	}

	let isConnecting = false
	let didConnectionFail = false
	async function connect(event: SubmitEvent) {
		event.preventDefault()
		isConnecting = true
		didConnectionFail = false
		serverURL.set(resolvedSelectedServer)

		try {
			const response = await fetch(`${resolvedSelectedServer}/`, {
				"method": "GET",
				"mode": "cors",
				"credentials": "include"
			})

			if (response.status === 200) {
				didConnectionFail = false
				const responseDocument = await response.json()
				CSRFToken.set(responseDocument.data.csrf_token)
			} else {
				throw new Error()
			}
		} catch (error) {
			didConnectionFail = true
			serverURL.set("")
		}

		isConnecting = false
	}
</script>

<SingleForm	on:submit={connect}>
	<div class="mdc-typography" slot="description_layer">
		{#if $hasToken}
			<h1 class="mdc-typography--body2">
				You are currently connected to <ServerDisplay address={$serverURL}/>.
			</h1>
			<p class="mdc-typography--body2">
				You may change your current server.
			</p>
			<p class="mdc-typography--body2">
				<strong>Note</strong>: Doing so may log out any current account.
			</p>
		{:else if $hasServer}
			<h1 class="mdc-typography--headline6">The client is trying to connect to the server</h1>
			<p class="mdc-typography--body2">
				Please wait for a moment.
			</p>
		{:else if didConnectionFail}
			<h1 class="mdc-typography--headline6">The client cannot connect to the server</h1>
			<p class="mdc-typography--body2">
				Please look for another compatible server.
			</p>
		{:else}
			<h1 class="mdc-typography--headline6">You are not yet connected to any server</h1>
			<p class="mdc-typography--body2">
				Choose or specify a server you want to connect.
			</p>
		{/if}
	</div>
	<fieldset class="mdc-layout-grid" slot="field_layer">
		<div class="mdc-layout-grid__inner">
			<div class="mdc-layout-grid__cell mdc-layout-grid__cell--full">
				<ChoiceListField
					fieldName="Servers"
					disabled={isConnecting}
					bind:value={selectedServer}
					rawChoices={serverChoices}
					choiceConverter={transformServer}
					IDPrefix="server_"
					errors={[]}/>
			</div>
			{#if mustBeCustomServer}
				<div class="mdc-layout-grid__cell mdc-layout-grid__cell--full">
					<TextField
						fieldName="Example: http://peratorakka.example.com"
						disabled={isConnecting}
						bind:value={customServer}
						errors={[]}/>
				</div>
			{/if}
		</div>
	</fieldset>
	<div class="mdc-card__actions" slot="action_layer">
		<div class="mdc-card__action-buttons">
			<TextCardButton
				kind="submit"
				disabled={isConnecting}
				label={$hasToken ? "Reconnect" : "Connect"}/>
		</div>
	</div>
</SingleForm>

<style lang="scss">
	@use "@/components/third-party/new_index";

	@use "@material/card";
	@use "@material/typography/mdc-typography";
	@use "@material/layout-grid/mdc-layout-grid";

	@include card.core-styles;

	.mdc-typography {
		margin-top: 1rem;

		> * {
			margin-top: 1rem;
		}
	}

	.mdc-layout-grid__inner {
		gap: 1em;
	}

	.mdc-layout-grid__cell--full {
		@extend .mdc-layout-grid__cell--span-4-phone;
		@extend .mdc-layout-grid__cell--span-8-tablet;
		@extend .mdc-layout-grid__cell--span-12-desktop;
	}
</style>
