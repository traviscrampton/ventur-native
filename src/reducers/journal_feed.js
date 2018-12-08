import { JOURNAL_FEED_LOADED } from "actions/action_types"
import { ADD_TO_JOURNAL_FEED } from "actions/journal_form"
import { UPDATE_FEED_DISTANCE } from "actions/chapter_form"

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

    case ADD_TO_JOURNAL_FEED:
      return {
        ...state,
        allJournals: action.payload
      }

    case UPDATE_FEED_DISTANCE:
      return {
        ...state,
        allJournals: action.payload
      }
    default:
      return state
  }
}
