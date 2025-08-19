<script lang="ts">
import type { CensoredAccount, ChoiceInfo } from "+/component"
import type { Account } from "+/entity"

import convertSnakeCaseToProperCase from "$/utility/convert_snake_case_to_proper_case"

import ElementalParagraph from "$/typography/elemental_paragraph.svelte"

let {
	censoredAccounts = $bindable(),
	transformAccount
}: {
	censoredAccounts: CensoredAccount[]
	transformAccount: (account: Account) => ChoiceInfo
} = $props()

function removeCensoredAccount(censoredAccountIndex: number) {
	const newCensoredAccounts = [ ...censoredAccounts ]
	newCensoredAccounts.splice(censoredAccountIndex, 1)
	censoredAccounts = newCensoredAccounts
}
</script>

<ElementalParagraph>
	Before checking the financial statements, accounts can be obsecured or hidden. Create a censor
	tag and they would be shown below this paragraph. Every tag indicates the censored account and
	which part is censored (account name only, amount only or quantity only, or all of them).
</ElementalParagraph>

{#each censoredAccounts as censoredAccount, i}
	<div class="chip outlined">
		{transformAccount(censoredAccount[0]).label}
		[{
			convertSnakeCaseToProperCase(censoredAccount[1])
			.toLocaleLowerCase()
			.split(" ")
			.slice(1)
			.join(" ")
		}]
		<button class="close material-icons" onclick={() => removeCensoredAccount(i)}>close</button>
	</div>
{/each}

<style lang="scss">
.chip { white-space: wrap; }

button {
	appearance: none;
	background: none;
	border: none;
	cursor: pointer;
}
</style>
