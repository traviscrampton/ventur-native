import { MY_JOURNALS_LOADED } from "../actions/action_types"
import { ADD_TO_MY_TRIPS } from "../actions/journal_form"

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

    case ADD_TO_MY_TRIPS:
      return {
        ...state,
        journals: state.journals.push(action.payload)
      }  
    default:
      return state
  }
}
