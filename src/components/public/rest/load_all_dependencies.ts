import type { ContextBundle, ResourceDependencyInfo } from "+/component"
import type { GeneralError } from "+/rest"
import type { Readable } from "svelte/store"
import type { RestorableEntity } from "+/entity"

import { get, writable, derived } from "svelte/store"

import { SEARCH_WITH_DELETED, MAXIMUM_PAGINATED_LIST_LENGTH } from "#/rest"

import makeJSONRequester from "$/rest/make_json_requester"
import mergeUniqueResources from "$/utility/merge_unique_resources"

export default async function loadAllDependencies<T extends RestorableEntity>(
	globalContext: ContextBundle,
	dependencyInfos: ResourceDependencyInfo<T>[],
	actions: {
		updateProgressRate: (rate: number) => void
		updateErrors: (errors: GeneralError[]) => void
	}
): Promise<void> {
	const hasEncounteredErrors = writable(false)
	const individualProgressRates: Readable<number>[] = []
	const individualErrors: Readable<GeneralError[]>[] = []
	const resourceLoadPromises = []

	for(const dependencyInfo of dependencyInfos) {
		const partialDependencyPath = dependencyInfo.partialPath
		const dependencyPathParameters = [
			[ "filter[search_mode]", SEARCH_WITH_DELETED ],
			[ "sort[0][0]", dependencyInfo.mainSortCriterion ],
			[ "sort[0][1]", "ascending" ],
			[ "sort[1][0]", "created_at" ],
			[ "sort[1][1]", "ascending" ],
			[ "page[limit]", MAXIMUM_PAGINATED_LIST_LENGTH ]
		]
		const dependencyOffset = writable(-1)
		const completeDependencyPath = derived([ dependencyOffset ], ([ newOffset ]) => {
			const completePath = `${partialDependencyPath}?${
				new URLSearchParams([
					...dependencyPathParameters,
					[ "page[offset]", `${newOffset + 1}` ],
				]).toString()
			}`

			return completePath
		})
		const individualTotalDependencyCount = writable(0)
		const individualProgressRate = derived(
			[ dependencyOffset, individualTotalDependencyCount ],
			([ newOffset, dependencyCount ]) => {
				return dependencyCount === 0
					? 0
					: (newOffset + 1) / dependencyCount
			}
		)

		const {
			"errors": localErrors,
			send
		} = makeJSONRequester({
			globalContext,
			"path": completeDependencyPath,
			"defaultRequestConfiguration": {
				"method": "GET"
			},
			"manualResponseHandlers": [
				{
					"statusCode": 200,
					"action": async (response: Response) => {
						const responseDocument = await response.json()
						const resources = responseDocument[dependencyInfo.resourceKey]
						localErrors.set([])
						dependencyInfo.setResources(mergeUniqueResources(
							dependencyInfo.getResources(),
							resources
						))
						dependencyOffset.update(lastDependencyOffset => {
							return lastDependencyOffset + resources.length
						})
						individualTotalDependencyCount.set(responseDocument.meta.overall_filtered_count)
					}
				},
				{
					"statusCode": 204,
					"action": async (_response: Response) => {
						localErrors.set([])
						dependencyInfo.setResources([])
					}
				}
			],
			"expectedErrorStatusCodes": [ 401 ]
		})

		async function loadRemainingResources(): Promise<void> {
			if (get(individualProgressRate) < 1 && !get(hasEncounteredErrors)) {
				return await send({}).then(loadRemainingResources)
			}

			return
		}

		const resourceLoadPromise = loadRemainingResources()
		individualProgressRates.push(individualProgressRate)
		individualErrors.push(localErrors)
		resourceLoadPromises.push(resourceLoadPromise)
	}

	const combinedProgressRate = derived(individualProgressRates, progressRates => {
		const total = progressRates.reduce(
			(previousTotal, currentRate) => previousTotal + currentRate,
			0
		)

		return total / progressRates.length
	})
	const combinedErrors = derived(individualErrors, errors => {
		return errors.reduce((previousErrors, currentLocalErrors) => [
			...previousErrors,
			...currentLocalErrors
		], [])
	})

	const unsubscribeInformer = combinedProgressRate.subscribe(actions.updateProgressRate)
	const unsubscribeErrorWatcher = combinedErrors.subscribe(errors => {
		hasEncounteredErrors.set(errors.length > 0)
	})

	await Promise.all(resourceLoadPromises)

	unsubscribeInformer()
	unsubscribeErrorWatcher()
}
