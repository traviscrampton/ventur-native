export const UPDATE_USER_FORM = "UPDATE_USER_FORM"
export function updateUserForm(payload) {
  return {
    type: UPDATE_USER_FORM,
    payload: payload
  }
}

export const POPULATE_USER_FORM = "POPULATE_USER_FORM"
export function populateUserForm(payload) {
  return {
    type: POPULATE_USER_FORM,
    payload: payload
  }
}