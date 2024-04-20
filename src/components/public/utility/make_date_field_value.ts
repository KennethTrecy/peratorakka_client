export default function makeDateFieldValue(date: Date) {
	const year =  date.getFullYear()
	const month =  makeTwoDigits(date.getMonth() + 1)
	const day =  makeTwoDigits(date.getDate())
	const fieldValue = `${year}-${month}-${day}`

	return fieldValue
}

function makeTwoDigits(value: number): string {
	return value <= 9 ? `0${value}` : `${value}`
}
