<script lang="ts">
	import type { ContextBundle } from "+/component"

	import { getContext } from "svelte"
	import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

	import { GLOBAL_CONTEXT } from "#/contexts"

	import assertAuthentication from "$/page_requirement/assert_authentication"

	import ArticleGrid from "$/layout/article_grid.svelte"
	import GridCell from "$/layout/grid_cell.svelte"
	import InnerGrid from "$/layout/inner_grid.svelte"
	import PrimaryHeading from "$/typography/primary_heading.svelte"
	import TextContainer from "$/typography/text_container.svelte"

	import Form from "%/profile/form.svelte"

	const globalContext = getContext(GLOBAL_CONTEXT) as ContextBundle

	assertAuthentication(globalContext, {
		afterNavigate,
		beforeNavigate,
		goto
	})
</script>

<svelte:head>
	<title>Your Profile</title>
</svelte:head>

<ArticleGrid>
	<InnerGrid>
		<GridCell kind="full">
			<PrimaryHeading>Profile</PrimaryHeading>
		</GridCell>
	</InnerGrid>
	<Form/>
	<InnerGrid>
		<GridCell kind="full">
			<TextContainer>Some features are not yet available. Come back later.</TextContainer>
		</GridCell>
	</InnerGrid>
</ArticleGrid>
