export const POPULATE_USER_PAGE = "POPULATE_USER_PAGE"
export function populateUserPage(payload) {
  return {
    type: POPULATE_USER_PAGE,
    payload: payload 
  }
}