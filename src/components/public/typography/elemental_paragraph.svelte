<script lang="ts">
import type { Snippet } from "svelte"
import type { TextAlignment } from "+/component"

let { alignment = "left", children }: {
	alignment?: TextAlignment
	children: Snippet
} = $props()

let paragraphClasses = $derived([
	"body-normal",
	alignment
].filter(Boolean).join(" "))
</script>

<p class={paragraphClasses}>
	{@render children()}
</p>

<style lang="scss">
.body-normal {
	&.left {
		text-align: left;
	}

	&.center {
		text-align: center;
	}

 	+ .body-normal {
		margin-top: 1rem;
	}
}
</style>
