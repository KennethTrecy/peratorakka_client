<script lang="ts">
	import type { Writable } from "svelte/store"
	import type { ContextBundle } from "+/component"

	import { getContext } from "svelte"

	import { GLOBAL_CONTEXT } from "#/contexts"

	import makeJSONRequester from "$/rest/make_json_requester"

	import GridCell from "$/layout/grid_cell.svelte"
	import ServerDisplay from "$/utility/server_display.svelte"
	import ShortParagraph from "$/typography/short_paragraph.svelte"
	import BasicForm from "$/form/basic_form.svelte"
	import TextCardButton from "$/button/card/text.svelte"
	import TextField from "$/form/text_field.svelte"

	const {
		serverURL,
		userEmail
	} = getContext(GLOBAL_CONTEXT) as ContextBundle as {
		serverURL: Writable<string>
		userEmail: Writable<string>
	}

	let email = ""
	let { isConnecting, errors, send } = makeJSONRequester({
		"path": "/api/v1/user",
		"defaultRequestConfiguration": {
			"method": "PATCH",
			"credentials": "include"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 204,
				"action": async (response: Response) => {
					errors.set([]);
					userEmail.set(email)
				}
			}
		],
		"expectedErrorStatusCodes": [ 401, 422 ]
	})

	async function update() {
		await send({
			"body": JSON.stringify({
				"user": {
					email
				}
			})
		})
	}
</script>

<BasicForm isConnecting={$isConnecting} errors={$errors} on:submit={update}>
	<svelte:fragment slot="fields">
		<ShortParagraph>
			Update the credentials you have on <ServerDisplay address={$serverURL}/>.
		</ShortParagraph>
		<GridCell kind="full">
			<TextField
				variant="email"
				fieldName="Email"
				disabled={$isConnecting}
				bind:value={email}
				errors={$errors}/>
		</GridCell>
	</svelte:fragment>
	<svelte:fragment slot="button_group">
		<TextCardButton
			kind="submit"
			disabled={$isConnecting}
			label="Update email"/>
	</svelte:fragment>
</BasicForm>
