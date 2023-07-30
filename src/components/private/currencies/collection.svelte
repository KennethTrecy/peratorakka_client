<script lang="ts">
	import type { Entity } from "%/currencies/types"

	export let data: Entity[]

	$: hasEntries = data.length > 0
</script>

<section>
	<h2>Available Currencies</h2>
	{#if hasEntries}
		<p>
			Below are the currencies that you have added on to your account.
			They can be used to be associated to financial accounts.
		</p>
		{#each data as entity(entity.id)}
			<article class="primary-container">
				<h3>{entity.code}</h3>
				<p>{entity.name}</p>
			</article>
		{/each}
	{:else}
		<p>
			There are no available currencies at the momenet.
			Create a currency to start.
		</p>
	{/if}
</section>

<style lang="scss">
	@use "@/components/third-party/index";

	h3 {
		@extend h5;
	}
</style>
