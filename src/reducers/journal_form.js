import { UPDATE_JOURNAL_FORM, CANCEL_JOURNAL_FORM } from "actions/journal_form"

const defaultJournalFormData = {
  form: {
    bannerImage: { uri: "" },
    title: "",
    description: "",
    status: "not_started",
    stage: "draft"
  }
}

export default (state = defaultJournalFormData, action) => {
  switch (action.type) {
    case UPDATE_JOURNAL_FORM:
      let { key, value } = action.payload
      return {
        ...state,
        form: {
          ...state.form,
          [key]: value
        }
      }
    case CANCEL_JOURNAL_FORM:
      return defaultJournalFormData
    default:
      return state
  }
}
