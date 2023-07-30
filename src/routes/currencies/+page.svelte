<script lang="ts">
	import Collection from "%/currencies/collection.svelte"
	import AddForm from "%/currencies/add_form.svelte"
</script>

<svelte:head>
	<title>Currencies</title>
</svelte:head>

<article>
	<h1>Currencies</h1>
	<AddForm/>
	<Collection data={[]}/>
</article>

<style lang="scss">
	@use "@/components/third-party/index";

	article {
		@extend .medium-margin;
		margin-left: 0em;
		margin-right: 0em;
	}
</style>
