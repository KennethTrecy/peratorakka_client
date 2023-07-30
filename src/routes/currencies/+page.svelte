<script lang="ts">
	import Collection from "%/currencies/collection.svelte"
</script>

<svelte:head>
	<title>Currencies</title>
</svelte:head>

<article>
	<h1>Your Currencies</h1>
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
