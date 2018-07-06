import { SET_CURRENT_USER } from "actions/action_types"
// this still doesn't work
const defaultAppState = {
  currentUser: null
}

export default (state = defaultAppState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload
      }
    default:
      return state
  }
}
