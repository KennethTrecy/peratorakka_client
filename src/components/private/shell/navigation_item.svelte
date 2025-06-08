<script lang="ts">
import { page } from "$app/state"
import { afterNavigate } from "$app/navigation"

let { address, label, icon }: {
	address: string;
	label: string;
	icon: string;
} = $props()
let currentAddress = $state("")

let isActive = $derived(address === currentAddress)
let current = $derived((isActive ? "page" : null) as "page"|null)
let itemClass = $derived([
	isActive ? "active" : "normal"
].filter(Boolean).join(" "))

afterNavigate(() => {
	currentAddress = page.url.pathname
})
</script>

<li>
	<a
		class={itemClass}
		href={address}
		aria-current={current}>
		<i class="material-icons" aria-hidden="true">{icon}</i>
		<span>{label}</span>
	</a>
</li>

<style lang="scss">
@use "@/components/third-party/index";

.normal, .active {
	display: flex;
	flex-flow: row nowrap;
	gap: 0.5rem;
}
</style>
