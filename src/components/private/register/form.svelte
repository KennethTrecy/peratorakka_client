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

	import GridCell from "$/layout/grid_cell.svelte"
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

	let username = ""
	let email = ""
	let password = ""
	let passwordConfirmation = ""
	let { isConnecting, errors, send } = makeJSONRequester({
		"path": "/register",
		"defaultRequestConfiguration": {
			"method": "POST"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 200,
				"action": async (response: Response) => {
					errors.set([])
					userEmail.set(email)
				}
			}
		],
		"expectedErrorStatusCodes": [ 401 ]
	})

	async function register() {
		await send({
			"body": JSON.stringify({
				username,
				email,
				password,
				"password_confirm": passwordConfirmation
			})
		})
	}
</script>

<SingleForm on:submit={register}>
	<div class="mdc-typography" slot="description_layer">
		<p class="mdc-typography--body2">
			Enter the credentials to be sent to <ServerDisplay address={$serverURL}/> to register.
		</p>
	</div>
	<svelte:fragment slot="field_layer">
		<GridCell kind="full">
			<TextField
				fieldName="Username"
				disabled={$isConnecting}
				bind:value={username}
				errors={$errors}/>
		</GridCell>
		<GridCell kind="full">
			<TextField
				variant="email"
				fieldName="Email"
				disabled={$isConnecting}
				bind:value={email}
				errors={$errors}/>
		</GridCell>
		<GridCell kind="full">
			<PasswordField
				fieldName="Password"
				disabled={$isConnecting}
				bind:value={password}
				errors={$errors}/>
		</GridCell>
		<GridCell kind="full">
			<PasswordField
				fieldName="Confirm Password"
				disabled={$isConnecting}
				bind:value={passwordConfirmation}
				errors={$errors}/>
		</GridCell>
	</svelte:fragment>
	<svelte:fragment slot="action_layer">
		<TextCardButton
			kind="submit"
			disabled={$isConnecting}
			label="Register"/>
	</svelte:fragment>
</SingleForm>

<style lang="scss">
	@use "@/components/third-party/new_index";

	@use "@material/typography/mdc-typography";

	.mdc-typography {
		margin-top: 1rem;
	}
</style>
