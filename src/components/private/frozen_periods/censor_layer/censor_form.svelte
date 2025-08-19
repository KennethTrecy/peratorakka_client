<script lang="ts">
import type { CensorshipVariant, CensoredAccount, ChoiceInfo } from "+/component"
import type { Account } from "+/entity"

import { CENSORSHIP_OBSECURED_AMOUNT_ONLY, censorshipVariants } from "#/component"

import transformString from "$/form/choice_info_transformer/transform_string"

import BasicForm from "$/form/basic_form.svelte"
import ChoiceListField from "$/form/choice_list_field.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"
import TextCardButton from "$/button/card/text.svelte"

const CENSORSHIP_VARIANTS = [ ...censorshipVariants ]

let {
	accounts,
	censoredAccounts = $bindable(),
	IDPrefix,
	isConnecting,
	transformAccount
}: {
	accounts: Account[]
	censoredAccounts: CensoredAccount[]
	IDPrefix: string
	isConnecting: boolean,
	transformAccount: (account: Account) => ChoiceInfo
} = $props()

let censoredAccountIDs = $derived(censoredAccounts.map(info => info[0].id))
let uncensoredAccounts = $derived(accounts.filter(
	account => !censoredAccountIDs.includes(account.id)
))
let hasUncensoredAccounts = $derived(uncensoredAccounts.length > 0)
let accountID = $state(`${accounts[0].id}`)
let censorshipLevel = $state<CensorshipVariant>(CENSORSHIP_OBSECURED_AMOUNT_ONLY)

function censorAccount(event: SubmitEvent) {
	event.preventDefault()
	censoredAccounts = [
		...censoredAccounts,
		[
			accounts.find(account => `${account.id}` === accountID) as Account,
			censorshipLevel
		]
	]

	accountID = `${uncensoredAccounts[0].id}`
	censorshipLevel = CENSORSHIP_OBSECURED_AMOUNT_ONLY
}
</script>

<BasicForm id={null} {isConnecting} errors={[]} onsubmit={censorAccount}>
	{#snippet fields()}
		{#if hasUncensoredAccounts}
			<ChoiceListField
				fieldName="Account"
				disabled={isConnecting}
				bind:value={accountID}
				rawChoices={uncensoredAccounts}
				choiceConverter={transformAccount}
				{IDPrefix}
				errors={[]}/>
		{:else}
			<ShortParagraph>
				All accounts have been censored.
			</ShortParagraph>
		{/if}
		<ChoiceListField
			fieldName="Censorship Level"
			disabled={isConnecting || !hasUncensoredAccounts}
			bind:value={censorshipLevel}
			rawChoices={CENSORSHIP_VARIANTS}
			choiceConverter={transformString}
			{IDPrefix}
			errors={[]}/>
	{/snippet}
	{#snippet button_group()}
		<TextCardButton
			kind="submit"
			disabled={isConnecting || !hasUncensoredAccounts}
			label="Censor"/>
	{/snippet}
</BasicForm>
