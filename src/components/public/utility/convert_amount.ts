import type { ExchangeRateInfo } from "+/rest"

import { multiplyAmount, divideAmount } from "!/index"

export default function convertAmount(
	originalAmount: string,
	exchangeRate: ExchangeRateInfo
): string {
	return divideAmount(
		multiplyAmount(originalAmount, exchangeRate.destination.value),
		exchangeRate.source.value
	);
}
