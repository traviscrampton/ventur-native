import { get, put, API_ROOT, setToken } from "../agent"
import { setLoadingTrue, setLoadingFalse } from "./common"
import { loadChapter, resetChapter } from "./chapter"

export const JOURNAL_FEED_LOADED = "JOURNAL_FEED_LOADED"
export const SINGLE_JOURNAL_LOADED = "SINGLE_JOURNAL_LOADED"

export const RESET_JOURNAL_TAB = "RESET_JOURNAL_TAB"
export function resetJournalShow() {
  return {
    type: RESET_JOURNAL_TAB
  }
}

export const  SUB_CONTENT_LOADING = "SUB_CONTENT_LOADING"
export function subContentLoading(payload) {
  return {
    type: SUB_CONTENT_LOADING,
    payload: payload
  }
}

export const updateBannerImage = async (journalId, img, dispatch) => {
  let formData = new FormData()
  formData.append("banner_image", img)

  const token = await setToken()
  fetch(`${API_ROOT}/journals/${journalId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: token
    },
    body: formData
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      dispatch(populateSingleJournal(data))
      dispatch(imageUploading(false))
    })
}

export function uploadBannerImage(journalId, img) {
  return function(dispatch, getState) {
    updateBannerImage(journalId, img, dispatch)
  }
}

export const POPULATE_SINGLE_JOURNAL = "POPULATE_SINGLE_JOURNAL"
export function populateSingleJournal(payload) {
  return {
    type: POPULATE_SINGLE_JOURNAL,
    payload: payload
  }
}

export const IMAGE_UPLOADING = "IMAGE_UPLOADING"
export function imageUploading(payload) {
  return {
    type: IMAGE_UPLOADING,
    payload: payload
  }
}

export function loadSingleJournal(journalId) {
  return async function(dispatch, getState) {
    try {
      const data = await get(`/journals/${journalId}/journal_metadata`)
      dispatch(populateSingleJournal(data.journal))
      await dispatch(fetchJournalChapters(journalId))
      await dispatch(fetchJournalGear(journalId))
      dispatch(subContentLoading(false))
    } catch {
      dispatch(populateSingleJournal({}))
    }
  }
}

export const POPULATE_JOURNAL_FEED = "POPULATE_JOURNAL_FEED"
export function populateJournalFeed(payload) {
  return {
    type: POPULATE_JOURNAL_FEED,
    payload: payload
  }
}

export const POPULATE_JOURNAL_CHAPTERS = "POPULATE_JOURNAL_CHAPTERS"
export function populateJournalChapters(payload) {
  return {
    type: POPULATE_JOURNAL_CHAPTERS,
    payload: payload
  }
}

export const fetchJournalChapters = journalId => {
  return async function(dispatch, getState) {
    try {
      const data = await get(`/journals/${journalId}/chapters`)
      dispatch(populateJournalChapters(data.chapters))
    } catch {
      console.log("we should populate something here")
    }
  }
}

export const fetchJournalGear = journalId => {
  return async function(dispatch, getState) {
    const data = await get(`/journals/${journalId}/gear_item_reviews`)
    dispatch(populateJournalGear(data.gearItemReviews))
  }
}

export const POPULATE_JOURNAL_GEAR = "POPULATE_JOURNAL_GEAR"
export const populateJournalGear = payload => {
  return {
    type: POPULATE_JOURNAL_GEAR,
    payload: payload
  }
}

export const TOGGLE_REFRESH = "TOGGLE_REFRESH"
export function toggleRefresh(payload) {
  return {
    type: TOGGLE_REFRESH,
    payload: payload
  }
}

export function toggleRefreshAndRefresh(payload) {
  return async function(dispatch, getState) {
    dispatch(toggleRefresh(true))

    try {
      const data = await get("/journals")
      dispatch(populateJournalFeed(data.journals))
    } catch {
      console.log("didn't work")
    }

    dispatch(toggleRefresh(false))
  }
}

export function requestForChapter(chapterId) {
  return function(dispatch, getState) {
    dispatch(setLoadingTrue())
    dispatch(resetChapter())
    get(`/chapters/${chapterId}`).then(res => {
      dispatch(loadChapter(res.chapter))
      dispatch(setLoadingFalse())
    })
  }
}

export function loadJournalFeed() {
  return async function(dispatch, getState) {
    dispatch(setLoadingTrue())

    try {
      const data = await get("/journals")
      dispatch(populateJournalFeed(data.journals))
    } catch {
      dispatch(populateJournalFeed([]))
    }

    dispatch(setLoadingFalse())
  }
}

export const UPDATE_TAB_INDEX = "UPDATE_TAB_INDEX"
export function updateTabIndex(payload) {
  return {
    type: UPDATE_TAB_INDEX,
    payload: payload
  }
}
