<script lang="ts">
import { get } from "svelte/store"
import { page } from "$app/stores"
import { afterNavigate } from "$app/navigation"

export let address: string
export let label: string
export let icon: string
let currentAddress = ""

$: isActive = address === currentAddress
$: current = (isActive ? "page" : null) as "page"|null
$: itemClass = [
	isActive ? "active" : "normal"
].filter(Boolean).join(" ")

afterNavigate(() => {
	currentAddress = get(page).url.pathname
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
