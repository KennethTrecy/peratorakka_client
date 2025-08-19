export default function censorNumber(number: string): string {
	return number
		.replaceAll(/(\d)/g, "0")
		.replace(/( 0+)+/, " 0")
		.replace(/(0+ )+/, "0 ")
		.replace(/^-?0+\/0+$/, "0")
}
