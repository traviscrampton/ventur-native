export const UPDATE_CURRENT_BOTTOM_TAB = "UPDATE_CURRENT_BOTTOM_TAB"
export function updateCurrentBottomTab(payload) {
  return {
    type: UPDATE_CURRENT_BOTTOM_TAB,
    payload: payload
  }
}

export const INITIAL_APP_LOADED = "INITIAL_APP_LOADED"
export function initialAppLoaded() {
  return {
    type: INITIAL_APP_LOADED
  }
}

export const SET_CURRENT_USER = "SET_CURRENT_USER"
export function setCurrentUser(payload) {
  return {
    type: SET_CURRENT_USER,
    payload: payload
  }
}

export const SET_WINDOW_DIMENSIONS = "SET_WINDOW_DIMENSIONS"
export function setWindowDimensions(payload) {
  return {
    type: SET_WINDOW_DIMENSIONS,
    payload: payload
  }
}
