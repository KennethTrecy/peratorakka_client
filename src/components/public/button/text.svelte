<script lang="ts">
import type { ButtonKind } from "+/component"

let {
	label,
	kind = "button",
	disabled = false,
	"class": otherClasses = "",
	onclick = () => {}
}: {
	label: string
	kind?: ButtonKind
	disabled?: boolean
	class?: string
	onclick?: (event: MouseEvent) => void
} = $props()

let buttonClasses = $derived([
	"btn",
	...otherClasses.split(" ")
].filter(Boolean).join(" "))
</script>

<button
	type={kind}
	{disabled}
	class={buttonClasses}
	{onclick}>
	<span>{label}</span>
</button>
