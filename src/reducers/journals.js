import { JOURNAL_FEED_LOADED, SINGLE_JOURNAL_LOADED } from "actions/action_types"

const defaultJournalData = {
	allJournals: [],
	journal: {
		user: {}
	},
	selectedTabKey: "chapters",
	tabs: [
		{ key: "chapters", title: "Chapters" },
		{ key: "gear_list", title: "Gear List" },
		{ key: "map", title: "Map" }
	]
}

export default (state = defaultJournalData, action) => {
	switch (action.type) {
		case JOURNAL_FEED_LOADED:
			return {
				...state,
				allJournals: action.payload
			}
		case SINGLE_JOURNAL_LOADED:
			return {
				...state,
				journal: action.payload
			}
		default:
			return state
	}
}
