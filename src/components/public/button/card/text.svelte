<script lang="ts">
import type { ButtonKind } from "+/component"

import TextButton from "$/button/text.svelte"

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
	"text",
	...otherClasses.split(" ")
].filter(Boolean).join(" "))
</script>

<TextButton
	{label}
	{kind}
	{disabled}
	class={buttonClasses}
	{onclick}/>
