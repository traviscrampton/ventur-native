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

export const SINGLE_JOURNAL_LOADED = "SINGLE_JOURNAL_LOADED"
export function populateJournal(payload) {
  return {
    type: SINGLE_JOURNAL_LOADED,
    payload: payload
  }
}

export function addJournalEverywhere(payload) {
  return function(dispatch, getState) {
    dispatch(addToJournalFeed(payload))
    dispatch(addToMyTrips(payload))
  }
}

export const ADD_TO_JOURNAL_FEED = "ADD_TO_JOURNAL_FEED"
export function addToJournalFeed(payload) {
  return {
    type: ADD_TO_JOURNAL_FEED,
    payload: payload
  }
}

export const ADD_TO_MY_TRIPS = "ADD_TO_MY_TRIPS"
export function addToMyTrips(payload) {
  return {
    type: ADD_TO_MY_TRIPS,
    payload: payload
  }
}

export function endOfForm(payload) {
  return function(dispatch, getState) {
    dispatch(cancelJournalForm())
  }
}
