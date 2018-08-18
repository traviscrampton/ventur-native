import { MY_JOURNALS_LOADED } from "actions/action_types"

const defaultJournalData = {
  journals: []
}

export default (state = defaultJournalData, action) => {
  switch (action.type) {
    case MY_JOURNALS_LOADED:
      return {
        ...state,
        journals: action.payload
      }
    default:
      return state
  }
}
