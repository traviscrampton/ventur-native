import {
  POPULATE_USER_PAGE,
  POPULATE_OFFLINE_CHAPTERS,
  POPULATE_USER_JOURNALS,
  POPULATE_USER_GEAR
} from "../actions/user"

const defaultAppState = {
  user: {
    journals: [],
    gear: []
  },
  offlineChapters: []
}

export default (state = defaultAppState, action) => {
  switch (action.type) {
    case POPULATE_USER_PAGE:
      return {
        ...state,
        user: Object.assign({}, state.user, action.payload)
      }
    case POPULATE_OFFLINE_CHAPTERS:
      return {
        ...state,
        offlineChapters: action.payload
      }
    case POPULATE_USER_GEAR:
      return {
        ...state,
        user: Object.assign({}, state.user, { gear: action.payload })
      }
    case POPULATE_USER_JOURNALS: {
      return {
        ...state,
        user: Object.assign({}, state.user, { journals: [...state.user.journals, action.payload] })
      }
    }
    default:
      return state
  }
}
