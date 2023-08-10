<script lang="ts">
	import type { Currency } from "+/entity"
	import CurrencyCard from "%/currencies/currency_card.svelte";

	export let isConnecting: boolean
	export let data: Currency[]

	$: hasEntries = data.length > 0
</script>

<section class="s12 m12 l12 grid small-space">
	<h2 class="s12 m12 l12 center-align">Available Currencies</h2>
	{#if isConnecting}
		<p class="s12 m12 l12">
			Please wait while the client request the list from the server.
		</p>
	{:else if hasEntries}
		<p class="s12 m12 l12">
			Below are the currencies that you have added on to your account.
			They can be used to be associated to financial accounts.
		</p>
		{#each data as entity(entity.id)}
			<CurrencyCard bind:data={entity} on:delete/>
		{/each}
	{:else}
		<p class="s12 m12 l12">
			There are no available currencies at the moment.
			Create a currency to start.
		</p>
	{/if}
</section>

<style lang="scss">
	@use "@/components/third-party/index";

	section.grid {
		align-items: start;
	}
</style>
