import { SINGLE_JOURNAL_LOADED, RESET_JOURNAL_TAB } from "actions/action_types"
import { REMOVE_CHAPTER_FROM_STATE } from "actions/editor"
import { PUSH_CHAPTER_TO_JOURNAL, UPDATE_FEED_DISTANCE } from "actions/chapter_form"

const defaultJournalData = {
  journal: {
    user: {},
    chapters: []
  },
  noRequest: false,
  loaded: false
}

export default (state = defaultJournalData, action) => {
  switch (action.type) {
    case SINGLE_JOURNAL_LOADED:
      return {
        ...state,
        journal: action.payload,
        loaded: true
      }
    case RESET_JOURNAL_TAB:
      return defaultJournalData
    case REMOVE_CHAPTER_FROM_STATE:
      let chapters = state.journal.chapters.filter(chapter => {
        return chapter.id != action.payload.id
      })

      return {
        ...state,
        journal: Object.assign({}, state.journal, { chapters: chapters })
      }
    case PUSH_CHAPTER_TO_JOURNAL:
      return {
        ...state,
        journal: Object.assign({}, state.journal, { chapters: action.payload.chapters, distance: action.payload.distance })
      }
    default:
      return state
  }
}
