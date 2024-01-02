<script lang="ts">
	import type { Writable } from "svelte/store"
	import type { ContextBundle } from "+/component"

	import { getContext } from "svelte"

	import { GLOBAL_CONTEXT } from "#/contexts"

	import makeJSONRequester from "$/rest/make_json_requester"

	import GridCell from "$/layout/grid_cell.svelte"
	import ServerDisplay from "$/utility/server_display.svelte"
	import ShortParagraph from "$/typography/short_paragraph.svelte"
	import CardForm from "$/form/card_form.svelte"
	import InnerGrid from "$/layout/inner_grid.svelte"
	import PasswordField from "$/form/password_field.svelte"

	const {
		serverURL
	} = getContext(GLOBAL_CONTEXT) as ContextBundle as {
		serverURL: Writable<string>
		userEmail: Writable<string>
	}

	let oldPassword = ""
	let newPassword = ""
	let confirmNewPassword = ""
	let { isConnecting, errors, send } = makeJSONRequester({
		"path": "/api/v1/user/password",
		"defaultRequestConfiguration": {
			"method": "PATCH",
			"credentials": "include"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 204,
				"action": async (_response: Response) => {
					errors.set([])
				}
			}
		],
		"expectedErrorStatusCodes": [ 400, 422 ]
	})

	async function update() {
		await send({
			"body": JSON.stringify({
				"user": {
					"old_password": oldPassword,
					"new_password": newPassword,
					"confirm_new_password": confirmNewPassword
				}
			})
		})
	}
</script>

<CardForm
	id={null}
	isConnecting={$isConnecting}
	errors={$errors}
	actionLabel="Change password"
	on:submit={update}>
	<ShortParagraph slot="text_description">
		Update the password you have on <ServerDisplay address={$serverURL}/>.
	</ShortParagraph>
	<svelte:fragment slot="fields">
		<PasswordField
			fieldName="Old Password"
			disabled={$isConnecting}
			bind:value={oldPassword}
			errors={$errors}/>
		<PasswordField
			fieldName="New Password"
			disabled={$isConnecting}
			bind:value={newPassword}
			errors={$errors}/>
		<PasswordField
			fieldName="Confirm New Password"
			disabled={$isConnecting}
			bind:value={confirmNewPassword}
			errors={$errors}/>
	</svelte:fragment>
</CardForm>
