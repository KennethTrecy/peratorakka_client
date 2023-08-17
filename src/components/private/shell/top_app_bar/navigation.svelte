<script lang="ts">
	import IconButton from "$/button/icon.svelte"

	export let label: string
	export let icon: string
</script>

<IconButton
	class="mdc-top-app-bar__navigation-icon"
	{label}
	{icon}
	on:click/>
