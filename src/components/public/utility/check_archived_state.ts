import type { RestorableEntity } from "+/entity"

export default function checkArchivedState(data: RestorableEntity): boolean {
	return typeof data.deleted_at !== "undefined" && data.deleted_at !== null
}
