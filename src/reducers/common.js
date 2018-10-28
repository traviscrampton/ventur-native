import { SET_CURRENT_USER, TOGGLE_TAB_BAR } from "actions/action_types"
import { UPDATE_CURRENT_BOTTOM_TAB, INITIAL_APP_LOADED } from "actions/common"
const defaultAppState = {
  currentUser: null,
  hideTabBar: false,
  initialAppLoaded: false,
  currentBottomTab: "Explore"
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
    case INITIAL_APP_LOADED:
      return {
        ...state,
        initialAppLoaded: true
      }
    default:
      return state
  }
}
