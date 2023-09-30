export default function mergeUniqueElements<T>(
	originalData: T[],
	newData: T[],
	generateKey: (element: T) => string|number
): T[] {
	const uniqueElements = [ ...originalData ]
	const existingIDs = new Set<string|number>()

	for (const element of originalData) {
		existingIDs.add(generateKey(element))
	}

	for (const element of newData) {
		const newKey = generateKey(element)

		if (!existingIDs.has(newKey)) {
			existingIDs.add(newKey)
			uniqueElements.push(element)
		}
	}

	return uniqueElements
}
