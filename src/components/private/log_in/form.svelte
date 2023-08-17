<script lang="ts">
	import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

	import makeJSONRequester from "$/rest/make_json_requester"
	import applyRequirements from "$/utility/apply_requirements"
	import {
		serverURL,
		userEmail,
		mustHaveToken,
		mustBeGuest
	} from "$/global_state"

	import PasswordField from "$/form/password_field.svelte"
	import ServerDisplay from "$/utility/server_display.svelte"
	import SingleForm from "$/form/single_form.svelte"
	import TextCardButton from "$/button/card/text.svelte"
	import TextField from "$/form/text_field.svelte"

	applyRequirements([
		mustHaveToken,
		mustBeGuest
	], {
		afterNavigate,
		beforeNavigate,
		goto
	})

	let email = ""
	let password = ""
	let { isConnecting, errors, send } = makeJSONRequester({
		"path": "/login",
		"defaultRequestConfiguration": {
			"method": "POST"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 204,
				"action": async (response: Response) => {
					errors.set([])
					userEmail.set(email)
				}
			}
		],
		"expectedErrorStatusCodes": [ 401 ]
	})

	async function logIn() {
		await send({
			"body": JSON.stringify({
				email,
				password
			})
		})
	}
</script>

<SingleForm on:submit={logIn}>
	<div class="mdc-typography" slot="description_layer">
		<p class="mdc-typography--body2">
			Enter the credentials you have on <ServerDisplay address={$serverURL}/> to log in.
		</p>
	</div>
	<fieldset slot="field_layer">
		<TextField
			variant="email"
			fieldName="Email"
			disabled={$isConnecting}
			bind:value={email}
			errors={$errors}/>
		<PasswordField
			fieldName="Password"
			disabled={$isConnecting}
			bind:value={password}
			errors={$errors}/>
	</fieldset>
	<div class="mdc-card__actions" slot="action_layer">
		<div class="mdc-card__action-buttons">
			<TextCardButton
				kind="submit"
				disabled={$isConnecting}
				label="Access"/>
		</div>
	</div>
</SingleForm>

<style lang="scss">
	@use "@/components/third-party/new_index";

	@use "@material/card";
	@use "@material/typography/mdc-typography";

	@include card.core-styles;

	.mdc-typography {
		margin-top: 1rem;
	}
</style>
