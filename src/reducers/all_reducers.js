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
import userForm from "reducers/userForm"
import comments from "reducers/comments"
import commentForm from "reducers/comment_form"
import routeEditor from "reducers/route_editor"

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
  userForm,
  chapterForm,
  comments,
  commentForm,
  routeEditor
})
