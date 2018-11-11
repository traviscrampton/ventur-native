export const POPULATE_USER_PAGE = "POPULATE_USER_PAGE"
export function populateUserPage(payload) {
  return {
    type: POPULATE_USER_PAGE,
    payload: payload
  }
}

export const POPULATE_OFFLINE_CHAPTERS = "POPULATE_OFFLINE_CHAPTERS"
export function populateOfflineChapters(payload) {
  console.log("PAYLOAD", payload)
  return {
    type: POPULATE_OFFLINE_CHAPTERS,
    payload: payload
  }
}
