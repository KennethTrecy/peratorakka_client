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

		if (lastPath.length === 0) {
			lastPath = path
			lastWeight = weight
			continue
		}

		if (weight < lastWeight) {
			lastWeight = weight
			lastPath = path
		}

		if (weight === lastWeight) {
			const timestampsInLastPath = lastPath.map(
				exchangeRate => new Date(exchangeRate.updated_at)
			)
			const timestampsInCurrentPath = path.map(
				exchangeRate => new Date(exchangeRate.updated_at)
			)

			timestampsInLastPath.sort().reverse()
			timestampsInCurrentPath.sort().reverse()

			// Get path with latest timestamp
			if (timestampsInCurrentPath[0].getTime() > timestampsInLastPath[0].getTime()) {
				lastPath = path
			}
		}
	}

	return lastPath
}
