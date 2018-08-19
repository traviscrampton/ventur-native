export const UPDATE_JOURNAL_FORM = "UPDATE_JOURNAL_FORM"
export function updateJournalForm(payload) {
  return {
    type: UPDATE_JOURNAL_FORM,
    payload: payload
  }
}

export const CANCEL_JOURNAL_FORM = "CANCEL_JOURNAL_FORM"
export function cancelJournalForm() {
  return {
    type: CANCEL_JOURNAL_FORM
  }
}