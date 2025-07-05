<script lang="ts">
let { label, icon, onclick }: {
	label: string
	icon: string
	onclick: () => void
} = $props()
</script>

<a
	href="#!"
	data-target="mobile-dropdown"
	class="sidenav-trigger"
	aria-label={label}
	{onclick}>
	<i class="material-icons">{icon}</i>
</a>
