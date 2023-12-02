<script lang="ts">
	import type { Writable } from "svelte/store"
	import type { ContextBundle } from "+/component"

	import { getContext } from "svelte"

	import { GLOBAL_CONTEXT } from "#/contexts"

	import makeJSONRequester from "$/rest/make_json_requester"

	import GridCell from "$/layout/grid_cell.svelte"
	import ServerDisplay from "$/utility/server_display.svelte"
	import ShortParagraph from "$/typography/short_paragraph.svelte"
	import FormBase from "$/form/base.svelte"
	import Grid from "$/layout/grid.svelte"
	import InnerGrid from "$/layout/inner_grid.svelte"
	import TextCardButton from "$/button/card/text.svelte"
	import TextContainer from "$/typography/text_container.svelte"
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

<InnerGrid>
	<GridCell kind="padder"/>
	<GridCell kind="narrow">
		<div class="single_form">
			<FormBase id={null} isConnecting={$isConnecting} errors={$errors} on:submit={update}>
				<TextContainer slot="lead_content">
					<ShortParagraph>
						Update the credentials you have on <ServerDisplay address={$serverURL}/>.
					</ShortParagraph>
				</TextContainer>
				<Grid slot="field_content">
					<InnerGrid>
						<GridCell kind="full">
							<TextField
								variant="email"
								fieldName="Email"
								disabled={$isConnecting}
								bind:value={email}
								errors={$errors}/>
						</GridCell>
					</InnerGrid>
				</Grid>
				<svelte:fragment slot="action_buttons">
					<TextCardButton
						kind="submit"
						disabled={$isConnecting}
						label="Update email"/>
				</svelte:fragment>
			</FormBase>
		</div>
	</GridCell>
	<GridCell kind="padder"/>
</InnerGrid>

<style lang="scss">
	@use "@/components/third-party/index";

	@use "@material/card";

	@include card.core-styles;

	:global(.single_form .mdc-card__content) {
		padding: 1rem;

		& + .mdc-card__content {
			padding-top: 0rem;
		}
	}

	// :global(.single_form .mdc-card__actions) {
	// 	justify-content: center;
	// }
</style>
