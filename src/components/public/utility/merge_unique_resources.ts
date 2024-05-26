import mergeUniqueElements from "$/utility/merge_unique_elements"

export default function mergeUniqueResources<T extends { id: number }>(
	originalData: T[],
	newData: T[]
): T[] {
	return mergeUniqueElements(originalData, newData, element => element.id)
}
