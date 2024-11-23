<script lang="ts">
import type { TextAlignment } from "+/component"

export let alignment: TextAlignment = "left"

$: paragraphClasses = [
	"body-normal",
	alignment
].filter(Boolean).join(" ")
</script>

<p class={paragraphClasses}>
	<slot/>
</p>


<style lang="scss">
@use "@/components/third-party/index";

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
