import type { ExchangeRateInfo } from "+/rest"
import weighPath from "$/utility/derive_exchange_rate/weigh_path"

export default function findLightestPath(
	paths: ExchangeRateInfo[][],
	currentTime: number
): ExchangeRateInfo[] {
	let lastWeight = Infinity
	let lastPath: ExchangeRateInfo[] = []

	for(const path of paths) {
		const weight = weighPath(path, currentTime)
		if (weight < lastWeight) {
			lastWeight = weight
			lastPath = path
		}

		if (weight === lastWeight) {
			const timeStampsInLastPath = lastPath.map(
				exchangeRate => new Date(exchangeRate.updated_at)
			)
			const timeStampsInCurrentPath = path.map(
				exchangeRate => new Date(exchangeRate.updated_at)
			)

			timeStampsInLastPath.sort().reverse()
			timeStampsInCurrentPath.sort().reverse()

			// Get path with latest timestamp
			if (timeStampsInCurrentPath[0] > timeStampsInLastPath[0]) {
				lastPath = path
			}
		}
	}

	return lastPath
}
