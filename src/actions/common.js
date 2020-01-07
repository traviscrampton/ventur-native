export const SET_LOADING_TRUE = 'SET_LOADING_TRUE';
export function setLoadingTrue() {
  return {
    type: SET_LOADING_TRUE
  };
}

export const SET_LOADING_FALSE = 'SET_LOADING_FALSE';
export function setLoadingFalse() {
  return {
    type: SET_LOADING_FALSE
  };
}

export const ADD_API_CREDENTIALS = 'ADD_API_CREDENTIALS';
export function addApiCredentials(payload) {
  return {
    type: ADD_API_CREDENTIALS,
    payload
  };
}

export const UPDATE_CURRENT_BOTTOM_TAB = 'UPDATE_CURRENT_BOTTOM_TAB';
export function updateCurrentBottomTab(payload) {
  return {
    type: UPDATE_CURRENT_BOTTOM_TAB,
    payload
  };
}

export const INITIAL_APP_LOADED = 'INITIAL_APP_LOADED';
export function initialAppLoaded() {
  return {
    type: INITIAL_APP_LOADED
  };
}

export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export function setCurrentUser(payload) {
  return {
    type: SET_CURRENT_USER,
    payload
  };
}

export const SET_WINDOW_DIMENSIONS = 'SET_WINDOW_DIMENSIONS';
export function setWindowDimensions(payload) {
  return {
    type: SET_WINDOW_DIMENSIONS,
    payload
  };
}

export const UPDATE_CONNECTION_TYPE = 'UPDATE_CONNECTION_TYPE';
export function updateConnectionType(payload) {
  return {
    type: UPDATE_CONNECTION_TYPE,
    payload
  };
}
