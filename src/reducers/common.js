import { SET_CURRENT_USER, TOGGLE_TAB_BAR } from "actions/action_types"
const defaultAppState = {
  currentUser: null,
  hideTabBar: false
}

export default (state = defaultAppState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: { id: 1, fullName: "Travis Crampton" }
      }
    case TOGGLE_TAB_BAR:
      return {
        ...state,
        hideTabBar: action.payload
      }  
    default:
      return state
  }
}
