<script lang="ts">
export let label: string
export let icon: string
</script>

<a
	href="#!"
	data-target="mobile-navigator"
	class="sidenav-trigger"
	aria-label={label}>
	<i class="material-icons">{icon}</i>
</a>

<style lang="scss">
@use "@/components/third-party/index";
</style>
