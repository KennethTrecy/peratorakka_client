export default function parenthesizeValue(isNegative: boolean, value: string): string {
	return `${isNegative ? "(" : ""}${value}${isNegative ? ")" : ""}`
}
