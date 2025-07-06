<script lang="ts">
import ArticleGrid from "$/layout/article_grid.svelte"
import GridCell from "$/layout/grid_cell.svelte"
import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
import TextContainer from "$/typography/text_container.svelte"
import InnerGrid from "$/layout/inner_grid.svelte"
import SecondaryHeading from "$/typography/secondary_heading.svelte"
import WeakenedTertiaryHeading from "$/typography/weakened_tertiary_heading.svelte"
import QuarternaryHeading from "$/typography/quarternary_heading.svelte"

// The following interfaces were based from source code of my personal website.
// Link: https://github.com/KennethTrecy/kennethtrecy.pages.dev/blob/1f3ffe42f81929a1114c2f3d17f98d125e1a75b5/src/routes/website_info/%2Bpage.svelte#L20
interface ThirdPartySoftware {
	name: string,
	homepage: string
}

interface ThirdPartyPackage extends ThirdPartySoftware {
	licenseName: string,
	licenseLink: string
}

const bundledThirdPartyPackages: ThirdPartyPackage[] = [
	{
		"name": "Svelte",
		"homepage": "https://svelte.dev/",
		"licenseName": "MIT",
		"licenseLink": "https://github.com/sveltejs/svelte/blob/master/LICENSE.md"
	}, {
		"name": "Fraction.js",
		"homepage": "https://raw.org/article/rational-numbers-in-javascript/",
		"licenseName": "MIT",
		"licenseLink": "https://github.com/rawify/Fraction.js/blob/main/LICENSE"
	}, {
		"name": "Chart.js",
		"homepage": "https://www.chartjs.org/docs/latest/",
		"licenseName": "MIT",
		"licenseLink": "https://github.com/chartjs/Chart.js/blob/master/LICENSE.md"
	}, {
		"name": "svelte-chartjs",
		"homepage": "https://saurav.tech/mdbsvelte/?path=/story/charts--examples",
		"licenseName": "MIT",
		"licenseLink": "https://github.com/SauravKanchan/svelte-chartjs/blob/master/LICENSE"
	}, {
		"name": "chartjs-plugin-autocolors",
		"homepage": "https://github.com/kurkle/chartjs-plugin-autocolors#readme",
		"licenseName": "MIT",
		"licenseLink": "https://github.com/kurkle/chartjs-plugin-autocolors/blob/main/LICENSE"
	}, {
		"name": "@material/layout-grid",
		"homepage": "https://github.com/material-components/material-components-web#readme",
		"licenseName": "MIT",
		"licenseLink": "https://github.com/material-components/material-components-web/blob/master/LICENSE"
	}, {
		"name": "lodash.debounce",
		"homepage": "https://lodash.com/",
		"licenseName": "MIT",
		"licenseLink": "https://github.com/lodash/lodash/blob/main/LICENSE"
	}, {
		"name": "semver",
		"homepage": "https://github.com/npm/node-semver#readme",
		"licenseName": "ISC",
		"licenseLink": "https://github.com/npm/node-semver/blob/main/LICENSE"
	}
]
const linkedThirdPartyPackages: ThirdPartyPackage[] = [
	{
		"name": "Materialize",
		"homepage": "https://materializeweb.com/",
		"licenseName": "MIT",
		"licenseLink": "https://github.com/materializecss/materialize/blob/main/LICENSE"
	}, {
		"name": "Roboto",
		"homepage": "https://fonts.google.com/specimen/Roboto",
		"licenseName": "Apache License, Version 2.0",
		"licenseLink": "https://fonts.google.com/specimen/Roboto/license"
	}, {
		"name": "Material Symbols",
		"homepage": "https://fonts.google.com/icons",
		"licenseName": "Apache License, Version 2.0",
		"licenseLink": "https://www.apache.org/licenses/LICENSE-2.0"
	}, {
		"name": "Noto Color Emoji",
		"homepage": "https://fonts.google.com/noto/specimen/Noto+Color+Emoji",
		"licenseName": "Open Font License",
		"licenseLink": "https://fonts.google.com/noto/specimen/Noto+Color+Emoji/license"
	}
]
</script>

<ArticleGrid>
	<InnerGrid>
		<GridCell kind="full">
			<SecondaryHeading>About</SecondaryHeading>
		</GridCell>
		<GridCell kind="full">
			<TextContainer>
				<section id="rationale">
					<WeakenedTertiaryHeading>🧐 Why Use Peratorakka?</WeakenedTertiaryHeading>
					<ElementalParagraph>
						Peratorakka allows you to track your expenses and investments. In this way, you could easily identify which expenses to be reduced or which investments are underperforming.
					</ElementalParagraph>
				</section>
				<section>
					<WeakenedTertiaryHeading>📦 Dependencies</WeakenedTertiaryHeading>
					<ElementalParagraph>
						Various open-source projects and third-party services have been utilized to create and host the website. They might be linked in the final output. Some are integrated during the bundling process, while others are involved in the deployment process.
					</ElementalParagraph>
					<section>
						<QuarternaryHeading>🧬 Bundled Dependencies</QuarternaryHeading>
						<ElementalParagraph>
							 Some dependencies mentioned below have been included during bundling phase of the website. These dependencies have significant impact on the source code.
						</ElementalParagraph>
						<ul>
							{#each bundledThirdPartyPackages as thirdPartyPackage(thirdPartyPackage.name)}
								<li>
									<a href={thirdPartyPackage.homepage}>{thirdPartyPackage.name}</a>
									(<a href={thirdPartyPackage.licenseLink}>{
										thirdPartyPackage.licenseName
									}</a>)
								</li>
							{/each}
						</ul>
					</section>
					<section>
						<QuarternaryHeading>🔗 Linked Dependencies</QuarternaryHeading>
						<ElementalParagraph>
							There are also some dependencies which have been used on the website by using <code>&lt;link&gt;</code> tags or through <code>src</code> attribute of <code>&lt;img&gt;</code> tags. They are included in the rendering process of a user's browser to enhance appearance.
						</ElementalParagraph>
						<ul>
							{#each linkedThirdPartyPackages as thirdPartyPackage(thirdPartyPackage.name)}
								<li>
									<a href={thirdPartyPackage.homepage}>{thirdPartyPackage.name}</a>
									(<a href={thirdPartyPackage.licenseLink}>{
										thirdPartyPackage.licenseName
									}</a>)
								</li>
							{/each}
						</ul>
					</section>
					<section>
						<QuarternaryHeading>↗️ Deployment</QuarternaryHeading>
						<ElementalParagraph>
							To make the website, <a href="https://kit.svelte.dev/">SvelteKit</a>
							(<a href="https://github.com/sveltejs/kit/blob/master/LICENSE">MIT</a>)
							has been used to bundle and deliver each web page.
							The bundling happens in a JAMstack platform named
							<a href="https://pages.cloudflare.com/">Cloudflare Pages</a>.
							After that, the bundled resources may be accessed anyone globally.
						</ElementalParagraph>
						<ElementalParagraph>
							However, some users may prefer to deploy the website on their own servers and that is also okay.
						</ElementalParagraph>
					</section>
				</section>
				<section>
					<WeakenedTertiaryHeading>🙋 Do you have concerns?</WeakenedTertiaryHeading>
					<ElementalParagraph>
						You may find the <a href="https://kennethtrecy.pages.dev/about_myself#contact_details">author's contact details</a> in his <a href="https://kennethtrecy.pages.dev">personal website</a>.
					</ElementalParagraph>
				</section>
			</TextContainer>
		</GridCell>
	</InnerGrid>
</ArticleGrid>

<style lang="scss">
section {
	:global(.body-normal) {
		margin-top: 0rem;
	}

	:global(h4) {
		text-align: left;
	}
}

#rationale :global(h3) {
	margin-top: 0rem;
}

a {
	color: var(--md-sys-color-on-surface-variant);
	text-decoration: dotted;
}
</style>
