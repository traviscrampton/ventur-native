import { TOGGLE_TAB_BAR } from "actions/action_types"
import { Dimensions } from "react-native"
import {
  SET_CURRENT_USER,
  UPDATE_CURRENT_BOTTOM_TAB,
  INITIAL_APP_LOADED,
  SET_WINDOW_DIMENSIONS,
  UPDATE_CONNECTION_TYPE
} from "actions/common"
const defaultAppState = {
  currentUser: null,
  hideTabBar: false,
  initialAppLoaded: false,
  currentBottomTab: "Explore",
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
  isOffline: true
}

export default (state = defaultAppState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload
      }
    case TOGGLE_TAB_BAR:
      return {
        ...state,
        hideTabBar: action.payload
      }
    case UPDATE_CURRENT_BOTTOM_TAB:
      return {
        ...state,
        currentBottomTab: action.payload
      }
    case SET_WINDOW_DIMENSIONS:
      return Object.assign({}, state, action.payload)
    case INITIAL_APP_LOADED:
      return {
        ...state,
        initialAppLoaded: true
      }

    case UPDATE_CONNECTION_TYPE:
      return {
        ...state,
        isOffline: action.payload
      }
    default:
      return state
  }
}
