import { combineReducers } from "redux"
import journalFeed from "reducers/journal_feed"
import journal from "reducers/journal"
import login from "reducers/login"

export default combineReducers({
  login,
  journalFeed,
  journal
})
