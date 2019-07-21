import { post, put } from "../agent"
import { populateSingleJournal } from "./journals"

export function persistJournal(navigationCallBack) {
  return function(dispatch, getState) {
    const { journalForm } = getState()
    if (journalForm.id) {
      persistJournalPut(journalForm, dispatch, navigationCallBack)
    } else {
      persistJournalPost(journalForm, dispatch, navigationCallBack)
    }
  }
}

export const persistJournalPost = async (params, dispatch, navigationCallBack) => {
  const res = await post("/journals", params)
  const payload = Object.assign({}, { id: res.id })

  dispatch(updateJournalForm(payload))
  navigationCallBack()
  dispatch(resetJournalForm())
}

export const persistJournalPut = async (params, dispatch, navigationCallBack) => {
  const journal = await put(`/journals/${params.id}`, params)

  dispatch(populateSingleJournal(journal))
  navigationCallBack()
  dispatch(resetJournalForm())
}

export const UPDATE_JOURNAL_FORM = "UPDATE_JOURNAL_FORM"
export function updateJournalForm(payload) {
  return {
    type: UPDATE_JOURNAL_FORM,
    payload: payload
  }
}

export const RESET_JOURNAL_FORM = "RESET_JOURNAL_FORM"
export function resetJournalForm() {
  return {
    type: RESET_JOURNAL_FORM
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
    // dispatch(addToMyTrips(payload))
  }
}

export const ADD_TO_JOURNAL_FEED = "ADD_TO_JOURNAL_FEED"
export function addToJournalFeed(payload) {
  return function(dispatch, getState) {
    let newPayload
    let allJournals = [...getState().journalFeed.allJournals]
    const foundJournal = allJournals.find(journal => {
      return payload.id == journal.id
    })

    if (foundJournal) {
      let index = allJournals.indexOf(foundJournal)
      newPayload = Object.assign([], allJournals, { [index]: payload })
    } else {
      newPayload = [...allJournals, payload]
    }
    dispatch(sendToReducerForJournalFeed(newPayload))
  }
}

export function sendToReducerForJournalFeed(payload) {
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
