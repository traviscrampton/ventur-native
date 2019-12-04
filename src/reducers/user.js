import {
  POPULATE_USER_PAGE,
  POPULATE_OFFLINE_CHAPTERS,
  POPULATE_USER_JOURNALS,
  POPULATE_USER_GEAR,
  TOGGLE_PROFILE_PHOTO_LOADING,
  TOGGLE_IS_LOADING,
  SET_DEFAULT_APP_STATE
} from "../actions/user"

import { REMOVE_GEAR_REVIEW } from "../actions/gear_item_review"
import { ADD_CREATED_GEAR_REVIEW } from "../actions/gear_review_form"

const defaultAppState = {
  user: {
    journals: [],
    gear: []
  },
  offlineChapters: [],
  profilePhotoLoading: false,
  isLoading: false
}

export default (state = defaultAppState, action) => {
  switch (action.type) {
    case POPULATE_USER_PAGE:
      return {
        ...state,
        user: Object.assign({}, state.user, action.payload)
      }
    case TOGGLE_PROFILE_PHOTO_LOADING:
      return {
        ...state,
        profilePhotoLoading: action.payload
      }

    case ADD_CREATED_GEAR_REVIEW:
      return {
        ...state,
        user: Object.assign({}, state.user, { gear: [...state.user.gear, action.payload] })
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
    case REMOVE_GEAR_REVIEW:
      return {
        ...state,
        user: Object.assign({}, state.user, {
          gear: state.user.gear.filter(gear => {
            return gear.id !== action.payload
          })
        })
      }
    case TOGGLE_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }
    case POPULATE_USER_JOURNALS: {
      return {
        ...state,
        user: Object.assign({}, state.user, { journals: [...state.user.journals, action.payload] })
      }
    }
    case SET_DEFAULT_APP_STATE:
      return defaultAppState
    default:
      return state
  }
}
