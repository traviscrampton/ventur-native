import { combineReducers } from "redux"
import journalFeed from "reducers/journal_feed"
import journal from "reducers/journal"
import login from "reducers/login"
import common from "reducers/common"
import editor from "reducers/editor"
import myJournals from "reducers/my_journals"
import journalForm from "reducers/journal_form"
import chapter from "reducers/chapter"
import chapterForm from "reducers/chapter_form"
import user from "reducers/user"

export default combineReducers({
  editor,
  common,
  login,
  journalFeed,
  myJournals,
  user,
  chapter,
  journalForm,
  journal,
  chapterForm
})
