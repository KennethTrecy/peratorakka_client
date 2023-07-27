<script lang="ts">
	import "@/components/third-party"
	import Shell from "@/components/shell.svelte"
</script>

<Shell>
	<slot name="main"></slot>
</Shell>

<style lang="scss">
	@import "@/components/third-party/index";
</style>
