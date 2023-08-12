export default function convertSnakeCaseToProperCase(name: string): string {
	const oldNameSegments = name.split("_")
	const newNameSegments = oldNameSegments.map(segment => (
		segment.slice(0, 1).toLocaleUpperCase() +
		segment.slice(1)
	))
	const properCasedName = newNameSegments.join(" ")

	return properCasedName
}
