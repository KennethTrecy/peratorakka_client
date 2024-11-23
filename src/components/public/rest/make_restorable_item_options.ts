import makeJSONRequester from "$/rest/make_json_requester"
import type { RestorableItemOptions } from "+/component"

export default function makeRestorableItemOptions(
	path: string,
	actions: {
		updateCacheData: () => void,
		removeCacheData: () => void,
		makeUpdatedBody: () => Record<string, unknown>,
	}
): RestorableItemOptions {
	const updateRequesterInfo = makeJSONRequester({
		path,
		"defaultRequestConfiguration": {
			"method": "PUT",
		},
		"manualResponseHandlers": [
			{
				"statusCode": 204,
				"action": async (_response: Response) => actions.updateCacheData()
			}
		],
		"expectedErrorStatusCodes": [ 400 ]
	})

	const deleteRequesterInfo = makeJSONRequester({
		path,
		"defaultRequestConfiguration": {
			"method": "DELETE",
		},
		"manualResponseHandlers": [
			{
				"statusCode": 204,
				"action": async (_response: Response) => actions.removeCacheData()
			}
		],
		"expectedErrorStatusCodes": [ 400 ]
	})

	const restoreRequesterInfo = makeJSONRequester({
		path,
		"defaultRequestConfiguration": {
			"method": "PATCH",
		},
		"manualResponseHandlers": [
			{
				"statusCode": 204,
				"action": async (_response: Response) => actions.removeCacheData()
			}
		],
		"expectedErrorStatusCodes": [ 400 ]
	})

	const forceDeleteRequesterInfo = makeJSONRequester({
		"path": `${path}/force`,
		"defaultRequestConfiguration": {
			"method": "DELETE",
		},
		"manualResponseHandlers": [
			{
				"statusCode": 204,
				"action": async (_response: Response) => actions.removeCacheData()
			}
		],
		"expectedErrorStatusCodes": [ 400 ]
	})

	return {
		"isConnectingToUpdate": updateRequesterInfo.isConnecting,
		"updateErrors": updateRequesterInfo.errors,
		"requestUpdate": async () => {
			await updateRequesterInfo.send({
				"body": JSON.stringify(actions.makeUpdatedBody())
			})
		},
		"isConnectingToDelete": deleteRequesterInfo.isConnecting,
		"deleteErrors": deleteRequesterInfo.errors,
		"requestDelete": async () => await deleteRequesterInfo.send({}),
		"isConnectingToRestore": restoreRequesterInfo.isConnecting,
		"restoreErrors": restoreRequesterInfo.errors,
		"requestRestore": async () => await restoreRequesterInfo.send({}),
		"isConnectingToForceDelete": forceDeleteRequesterInfo.isConnecting,
		"forceDeleteErrors": forceDeleteRequesterInfo.errors,
		"requestForceDelete": async () => await forceDeleteRequesterInfo.send({})
	}
}
