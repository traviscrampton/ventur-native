import { UPDATE_JOURNAL_FORM, RESET_JOURNAL_FORM } from "actions/journal_form"

const defaultJournalFormData = {
  id: null,  
  title: "",
  description: "",
  status: "not_started",
  distanceType: "kilometers",
  includedCountries: []
}

export default (state = defaultJournalFormData, action) => {
  switch (action.type) {
    case UPDATE_JOURNAL_FORM:
      return Object.assign({}, state, action.payload)
    case RESET_JOURNAL_FORM:
      return defaultJournalFormData
    default:
      return state
  }
}
