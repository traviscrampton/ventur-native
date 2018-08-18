import { SINGLE_JOURNAL_LOADED, RESET_JOURNAL_TAB } from "actions/action_types"

const defaultJournalData = {
  journal: {
    user: {},
    chapters: []
  },
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
    default:
      return state
  }
}
