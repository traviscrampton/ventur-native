import { get } from "agent"
import { setLoadingTrue, setLoadingFalse } from "actions/common"

export const JOURNAL_FEED_LOADED = "JOURNAL_FEED_LOADED"
export const SINGLE_JOURNAL_LOADED = "SINGLE_JOURNAL_LOADED"

export const RESET_JOURNAL_TAB = "RESET_JOURNAL_TAB"
export function resetJournalShow() {
  return {
    type: RESET_JOURNAL_TAB
  }
}

export const POPULATE_SINGLE_JOURNAL = "POPULATE_SINGLE_JOURNAL"
export function populateSingleJournal(payload) {
  return {
    type: POPULATE_SINGLE_JOURNAL,
    payload: payload
  }
}

export function loadSingleJournal(journalId) {
  return function(dispatch, getState) {
    dispatch(setLoadingTrue())
    
    get(`/journals/${journalId}`).then(data => {
      dispatch(populateSingleJournal(data.journal))
      dispatch(setLoadingFalse())
    })
  }
}

export const POPULATE_JOURNAL_FEED = "POPULATE_JOURNAL_FEED"
export function populateJournalFeed(payload) {
  return {
    type: POPULATE_JOURNAL_FEED,
    payload: payload
  }
}

export function loadJournalFeed() {
  return function(dispatch, getState) {
    dispatch(setLoadingTrue())
    get("/journals").then(data => {
      dispatch(populateJournalFeed(data.journals))
      dispatch(setLoadingFalse())
    })
  }
}
