import { POPULATE_USER_PAGE } from "actions/user"

const defaultAppState = {
  user: {
    journals: []
  }
}

export default (state = defaultAppState, action) => {
  switch (action.type) {
    case POPULATE_USER_PAGE:
      return {
        ...state,
        user: action.payload
      }

    default:
      return state
  }
}
