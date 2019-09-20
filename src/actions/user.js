import { get } from "../agent"
import { setLoadingTrue, setLoadingFalse } from "./common"

export const POPULATE_USER_PAGE = "POPULATE_USER_PAGE"
export function populateUserPage(payload) {
  return {
    type: POPULATE_USER_PAGE,
    payload: payload
  }
}

export const POPULATE_OFFLINE_CHAPTERS = "POPULATE_OFFLINE_CHAPTERS"
export function populateOfflineChapters(payload) {
  return {
    type: POPULATE_OFFLINE_CHAPTERS,
    payload: payload
  }
}

export const POPULATE_USER_JOURNALS = "POPULATE_USER_JOURNALS"
export function populateUserJournals(payload) {
  return {
    type: POPULATE_USER_JOURNALS,
    payload: payload
  }
}

export const POPULATE_USER_GEAR = "POPULATE_USER_GEAR"
export function populateUserGear(payload) {
  return {
    type: POPULATE_USER_GEAR,
    payload: payload
  }
}

export function getUserGear(id) {
  return async function(dispatch, getState) {
    try {
      const data = await get(`/users/${id}/gear_item_reviews`)
      dispatch(populateUserGear(data.gearItemReviews))
    } catch {
      console.log("WE DONE FUCKED UP BOO BOO!")
    }
  }
}

export function getProfilePageData() {
  return async function(dispatch, getState) {
    dispatch(setLoadingTrue())
    const currentUserId = getState().common.currentUser.id
    try {
      const res = await get(`/users/${currentUserId}`)
      dispatch(populateUserPage(res.user))
      dispatch(getUserGear(currentUserId))
    } catch {
      console.log("rut roh")
    }

    dispatch(setLoadingFalse())
  }
}
