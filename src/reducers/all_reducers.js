import { combineReducers } from "redux"
import journalFeed from "reducers/journal_feed"
import journal from "reducers/journal"
import login from "reducers/login"
import common from "reducers/common"
import editor from "reducers/editor"

export default combineReducers({
  editor,
  common,
  login,
  journalFeed,
  journal
})
