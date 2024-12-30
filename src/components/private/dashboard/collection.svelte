<script lang="ts">
import type { Currency, Formula, NumericalTool } from "+/entity"
import type { GeneralError, SortOrder, NumericalToolConclusion } from "+/rest"

import CollectionCatalog from "$/catalog/collection.svelte"
import DashboardCard from "%/dashboard/dashboard_card.svelte"
import Flex from "$/layout/flex.svelte"
import ListSpecifier from "$/form/list_specifier.svelte"

export let isConnecting: boolean
export let data: NumericalTool[]
export let formulae: Formula[]
export let currencies: Currency[][]
export let conclusions: (NumericalToolConclusion|null)[]
export let sortCriterion: string
export let sortOrder: SortOrder
export let progressRate: number

export let listErrors: GeneralError[]

const availableSortCriteria = [
	"name",
	"order",
	"created_at",
	"updated_at",
	"deleted_at"
]
</script>

<CollectionCatalog collectiveName="Summarized Information" {isConnecting} {data} {progressRate}>
	<svelte:fragment slot="filled_collection_description">
		Below are the summarized information that was instructed by your numerical tools in your
		profile.
	</svelte:fragment>
	<Flex slot="list_specifier" justifyContent="responsive_stretch" mustPad={false}>
		<ListSpecifier
			searchMode={null}
			bind:sortCriterion={sortCriterion}
			bind:sortOrder={sortOrder}
			{isConnecting}
			{availableSortCriteria}
			errors={listErrors}/>
	</Flex>
	<svelte:fragment slot="cards">
		{#each data as entity, i}
			<DashboardCard
				bind:data={entity}
				{formulae}
				currencies={currencies[i]}
				conclusion={conclusions[i]}/>
		{/each}
	</svelte:fragment>
	<svelte:fragment slot="empty_collection_description">
		There are no available numerical tools at the moment.
		Create a numerical tools to view summarized information.
	</svelte:fragment>
</CollectionCatalog>
