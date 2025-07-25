export default function dashValue(isNegative: boolean, value: string): string {
	return `${isNegative ? "-" : ""}${value}`
}
