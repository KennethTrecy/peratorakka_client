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
	<slot slot="filled_collection_description" name="filled_collection_description"/>
	<slot slot="empty_collection_description" name="empty_collection_description"/>
	<slot slot="list_specifier" name="list_specifier"/>
	<slot slot="available_content" name="cards"/>
</CatalogBase>
