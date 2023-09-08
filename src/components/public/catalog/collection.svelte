<script lang="ts">
	import CatalogBase from "$/catalog/base.svelte"
	import Flex from "$/layout/flex.svelte"
	import SecondaryHeading from "$/typography/secondary_heading.svelte"

	export let isConnecting: boolean
	export let collectiveName: string
	export let data: unknown[]
</script>

<CatalogBase
	{isConnecting}
	{collectiveName}
	{data}>
	<SecondaryHeading slot="name">Available {collectiveName}</SecondaryHeading>
	<Flex slot="filled_collection_description" direction="column" mustPad={false}>
		<slot name="filled_collection_description"/>
	</Flex>
	<Flex slot="empty_collection_description" direction="column" mustPad={false}>
		<slot name="empty_collection_description"/>
	</Flex>
	<slot slot="available_content" name="cards"/>
</CatalogBase>
