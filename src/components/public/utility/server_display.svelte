<script lang="ts">
	export let address: string

	$: addressParts = address.split(".")
</script>

<code>
	{#each addressParts as part, i}
		{#if i > 0}<wbr/>.{part}{:else}{part}{/if}
	{/each}
</code>
