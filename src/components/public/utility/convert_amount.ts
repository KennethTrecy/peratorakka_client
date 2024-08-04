import type { ExchangeRateInfo } from "+/rest"

import { multiplyAmount } from "!/index"

export default function convertAmount(
	originalAmount: string,
	exchangeRate: ExchangeRateInfo
): string {
	const rate = `${exchangeRate.source.value}/${exchangeRate.destination.value}`;

	return multiplyAmount(originalAmount, rate);
}
