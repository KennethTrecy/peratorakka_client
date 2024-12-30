export default function formatPercentage(
	rawAmount: number,
	maxAmount: number,
	fractionalDigits: number
): string {
	const rawPercentage = rawAmount / maxAmount
	return rawPercentage.toLocaleString("en-US", {
		"style": "percent",
		"maximumFractionDigits": fractionalDigits
	})
}
