<script lang="ts">
let { address }: {
	address: string
} = $props()

let addressParts = $derived(address.split("."))
</script>

<code>
	{#each addressParts as part, i}
		{#if i > 0}<wbr/>.{part}{:else}{part}{/if}
	{/each}
</code>
