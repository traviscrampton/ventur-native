import { combineReducers } from "redux"
import journalFeed from "./journal_feed"
import journal from "./journal"
import login from "./login"
import common from "./common"
import editor from "./editor"
import myJournals from "./my_journals"
import journalForm from "./journal_form"
import chapter from "./chapter"
import chapterForm from "./chapter_form"
import user from "./user"
import userForm from "./userForm"
import comments from "./comments"
import commentForm from "./comment_form"
import routeEditor from "./route_editor"
import routeViewer from "./route_viewer"
import journalRoute from "./journal_route"
import stravaActivityImport from "./strava_activity_import"
import cameraRoll from "./camera_roll"
import gearReviewForm from "./gear_review_form"

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
  routeViewer,
  routeEditor,
  journalRoute,
  stravaActivityImport,
  cameraRoll,
  gearReviewForm
})
