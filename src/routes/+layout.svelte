<script lang="ts">
	import "@/components/third-party"
	import Shell from "%/shell.svelte"
</script>

<Shell>
	<slot slot="main"></slot>
</Shell>

<style lang="scss">
	@use "@/components/third-party/index";
</style>
