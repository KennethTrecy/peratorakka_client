import type { ChoiceInfo } from "+/component"

export const RECOMMENDED_API_VERSION = "0.4.0"

export const MAINTENANCE_EXPIRATION_MECHANISM = "maintenance"

export const SEARCH_NORMALLY = "normal"
export const SEARCH_WITH_DELETED = "with_deleted"
export const SEARCH_ONLY_DELETED = "only_deleted"

export const SEARCH_MODES = [
	SEARCH_NORMALLY,
	SEARCH_WITH_DELETED,
	SEARCH_ONLY_DELETED
] as const

export const SEARCH_NORMALLY_OPTION: ChoiceInfo = {
	"label": "Present",
	"data": SEARCH_NORMALLY
}

export const SEARCH_WITH_DELETED_OPTION: ChoiceInfo = {
	"label": "All",
	"data": SEARCH_WITH_DELETED
}

export const SEARCH_ONLY_DELETED_OPTION: ChoiceInfo = {
	"label": "Archived",
	"data": SEARCH_ONLY_DELETED
}

export const ASCENDING_ORDER = "ascending"
export const DESCENDING_ORDER = "descending"
export const SORT_ORDERS = [
	ASCENDING_ORDER,
	DESCENDING_ORDER
] as const

export const MAXIMUM_PAGINATED_LIST_LENGTH = "20"

export const SUPPORTED_TOKEN_EXPIRATION_TYPES = {
	"expiration_types": [ MAINTENANCE_EXPIRATION_MECHANISM ]
}

export const ACCOUNT_CONSTELLATION_KIND = "account"
export const SUM_CONSTELLATION_KIND = "sum"
export const AVERAGE_CONSTELLATION_KIND = "average"
export const FORMULA_CONSTELLATION_KIND = "formula"

export const ACCEPTABLE_CONSTELLATION_KINDS = [
    ACCOUNT_CONSTELLATION_KIND,
    SUM_CONSTELLATION_KIND,
    AVERAGE_CONSTELLATION_KIND,
    FORMULA_CONSTELLATION_KIND
] as const
