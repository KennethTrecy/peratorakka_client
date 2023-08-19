<script lang="ts">
	import GridCell from "$/layout/grid_cell.svelte"
	import InnerGrid from "$/layout/inner_grid.svelte"
	import SecondaryHeading from "$/typography/secondary_heading.svelte"

	export let individualName: string
	export let mayShowForm: boolean
</script>

<InnerGrid>
	<GridCell kind="full">
		<SecondaryHeading>Add {individualName}</SecondaryHeading>
	</GridCell>
	<GridCell kind="majority">
		<slot name="description"></slot>
	</GridCell>
	<GridCell kind="minority">
		{#if mayShowForm}
			<slot name="form"></slot>
		{:else}
			<slot name="requirement"></slot>
		{/if}
	</GridCell>
</InnerGrid>
