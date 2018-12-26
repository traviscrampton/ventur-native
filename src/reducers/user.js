import { POPULATE_USER_PAGE, POPULATE_OFFLINE_CHAPTERS } from "actions/user"


const defaultAppState = {
  user: {
    journals: []
  },
  offlineChapters: []
}

export default (state = defaultAppState, action) => {
  switch (action.type) {
    case POPULATE_USER_PAGE:
      return {
        ...state,
        user: action.payload
      }
    case POPULATE_OFFLINE_CHAPTERS:
      return {
        ...state,
        offlineChapters: action.payload
      }
    default:
      return state
  }
}
