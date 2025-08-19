<script lang="ts">
import type { CensoredAccount } from "+/component"
import type { Account, Currency } from "+/entity"

import makeAccountTransformer from "$/form/choice_info_transformer/make_account_transformer"

import CensorForm from "%/frozen_periods/censor_layer/censor_form.svelte"
import CensorTags from "%/frozen_periods/censor_layer/censor_tags.svelte"
import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
import Flex from "$/layout/flex.svelte"
import GridCell from "$/layout/grid_cell.svelte"
import InteractiveContainer from "$/layout/interactive_container.svelte"
import ReactiveProgressBar from "$/utility/reactive_progress_bar.svelte"
import TextContainer from "$/typography/text_container.svelte"

let {
	currencies,
	accounts,
	censoredAccounts = $bindable(),
	isRequestingDependencies,
	hasLoadedAllDependencies
}: {
	currencies: Currency[]
	accounts: Account[]
	censoredAccounts: CensoredAccount[]
	isRequestingDependencies: boolean
	hasLoadedAllDependencies: boolean
} = $props()

let transformAccount = $derived(makeAccountTransformer(currencies))
</script>

<GridCell kind="full">
	<InteractiveContainer>
		{#snippet text()}
			<TextContainer>
				<CensorTags bind:censoredAccounts={censoredAccounts} {transformAccount}/>
			</TextContainer>
		{/snippet}
		{#snippet widget()}
			<ReactiveProgressBar
				isLoading={isRequestingDependencies}
				progressBarLabel="Waiting for server's response..."/>
			{#if isRequestingDependencies}
				<Flex direction="column" mustPad={false}>
					<TextContainer>
						<ElementalParagraph alignment="center">
							Initial data for the form is loading...
						</ElementalParagraph>
					</TextContainer>
				</Flex>
			{:else if hasLoadedAllDependencies}
				<CensorForm
					{accounts}
					bind:censoredAccounts={censoredAccounts}
					IDPrefix="censor_"
					isConnecting={isRequestingDependencies}
					{transformAccount}/>
			{:else}
				<ElementalParagraph>
					At least one account must exist in the profile to show the censor form.
				</ElementalParagraph>
			{/if}
		{/snippet}
	</InteractiveContainer>
</GridCell>
