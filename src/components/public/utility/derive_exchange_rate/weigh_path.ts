import type { ExchangeRateInfo } from "+/rest"

export default function weighPath(path: ExchangeRateInfo[], currentTime: number): number {
	let totalWeight = 0

	for (const exchangeRate of path) {
		const lastUpdate = new Date(exchangeRate.updated_at)
		const edgeWeight = currentTime - lastUpdate.getTime()
		totalWeight += edgeWeight
	}

	return totalWeight
}
