import type { NumericalTool } from "+/entity"

export default function parseNumericalTool(numericalTool: NumericalTool|any): NumericalTool {
	numericalTool.configuration = JSON.parse(numericalTool.configuration)
	return numericalTool
}
