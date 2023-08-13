<script lang="ts">
	import CurrencyCard from "%/currencies/currency_card.svelte";

	export let isConnecting: boolean
	export let collectiveName: string
	export let data: unknown[]

	$: hasData = data.length > 0
</script>

<section class="s12 m12 l12 grid small-space">
	<h2 class="s12 m12 l12 center-align">Available {collectiveName}</h2>
	{#if isConnecting}
		<div class="s12 m12 l12 grid large-space center-align">
			<div class="s12 m12 l12 center-align">
				<span class="loader large margin" role="progressbar"></span>
			</div>
			<p class="s12 m12 l12">
				Please wait while the client request the list from the server.
			</p>
		</div>
	{:else if hasData}
		<p class="s12 m12 l12">
			<slot name="filled_collection_description"></slot>
		</p>
		<table class="border medium-space center-align">
			<thead>
				<tr>
					<slot name="column_headers"></slot>
				</tr>
			</thead>
			<tbody>
				<slot name="rows"></slot>
			</tbody>
		</table>
	{:else}
		<p class="s12 m12 l12">
			<slot name="empty_collection_description"></slot>
		</p>
	{/if}
</section>

<style lang="scss">
	@use "@/components/third-party/index";

	section.grid {
		align-items: start;
	}
</style>
