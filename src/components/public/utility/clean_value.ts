export default function cleanValue(value: string): [ boolean, string ] {
	const isNegative = value.startsWith("-")
	const cleanAmount = isNegative ? value.slice(1): value

	return [ isNegative, cleanAmount ]
}
