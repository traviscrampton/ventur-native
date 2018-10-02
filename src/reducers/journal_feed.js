import { JOURNAL_FEED_LOADED, ADD_TO_JOURNAL_FEED } from "actions/action_types"

const defaultJournalData = {
	allJournals: []
}

export default (state = defaultJournalData, action) => {
	switch (action.type) {
		case JOURNAL_FEED_LOADED:
			return {
				...state,
				allJournals: action.payload
			}
		default:
			return state
	}
}
