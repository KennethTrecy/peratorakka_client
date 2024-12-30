import { makeHSVColorAsRGBColor } from "!/index"

export default function generateColors(colorsRequired: number): [ string[], string[] ] {
	const MAXIMUM_DEGREES = 360

	const initialDegrees = Math.random() * MAXIMUM_DEGREES
	const substep = MAXIMUM_DEGREES / colorsRequired
	const recommendedGroups = colorsRequired < 5
		? colorsRequired
		: (
			colorsRequired % 6 === 0 || colorsRequired % 9 === 0
				? 3
				: (
					colorsRequired % 7 === 0
						? 4
						: (
							colorsRequired % 2 === 0
								? 2
								: 5
						)
				)
		)
	const step = MAXIMUM_DEGREES / recommendedGroups
	let offset = 0
	const normalColors = []
	const saturatedColors = []

	for (let i = 0; i < colorsRequired; i++) {
		if (i > 0 && i % recommendedGroups === 0) {
			offset += substep * (recommendedGroups - 1)
		}

		const hue = (initialDegrees + step * i + offset) % MAXIMUM_DEGREES

		const normalColor = makeHSVColorAsRGBColor(hue, 100, 100)
		const saturatedColor = makeHSVColorAsRGBColor(hue, 50, 75)

		normalColors.push(normalColor)
		saturatedColors.push(saturatedColor)
	}

	return [
		normalColors,
		saturatedColors
	]
}
