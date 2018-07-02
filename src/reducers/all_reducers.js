import { combineReducers } from "redux"
import journalFeed from "reducers/journal_feed"
import journal from "reducers/journal"

export default combineReducers({
	journalFeed,
	journal
})
