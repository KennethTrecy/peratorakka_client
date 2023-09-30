import mergeUniqueElements from "$/utility/merge_unique_elements"

export default function mergeUniqueResources<T>(
	originalData: T[],
	newData: T[]
): T {
	return mergeUniqueElements(originalData, newData, element => element.id)
}
