<script lang="ts">
let { label, icon }: {
	label: string;
	icon: string;
} = $props();
</script>

<a
	href="#!"
	data-target="mobile-dropdown"
	class="sidenav-trigger"
	aria-label={label}>
	<i class="material-icons">{icon}</i>
</a>

<style lang="scss">
@use "@/components/third-party/index";
</style>
