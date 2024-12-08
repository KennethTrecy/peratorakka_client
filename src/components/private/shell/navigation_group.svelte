<script lang="ts">
import { get } from "svelte/store"
import { page } from "$app/stores"
import { afterNavigate } from "$app/navigation"

export let label: string
export let icon: string
let currentAddress = ""

// $: isActive = address === currentAddress
$: isActive = true
$: current = (isActive ? "page" : null) as "page"|null
$: itemClass = [
	"dropdown-trigger",
	isActive ? "active" : "normal"
].filter(Boolean).join(" ")
$: id = label.replace(" ", "_")
$: bookmark = `#${id}`

afterNavigate(() => {
	currentAddress = get(page).url.pathname
})
</script>

<li>
	<a
		class={itemClass}
		aria-current={current}
		data-target={id}
		href={bookmark}>
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
