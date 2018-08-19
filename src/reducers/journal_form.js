import { UPDATE_JOURNAL_FORM } from "actions/journal_form"

const defaultJournalFormData = {
  form: {
    cardImageUrl: "",
    title: "",
    description: "",
    status: 0,
    stage: ""
  }
}

export default (state = defaultJournalFormData, action) => {
  switch (action.type) {
    case UPDATE_JOURNAL_FORM:
      let { key, value } = action.payload
      console.log(key, value)
      return {
        ...state,
        form: {
          ...state.form,
          [key]: value
        }
      }
    default:
      return state
  }
}
