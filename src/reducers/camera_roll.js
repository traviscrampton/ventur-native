import {
  UPDATE_CHAPTER_FORM,
  RESET_CHAPTER_FORM,
  TOGGLE_CHAPTER_MODAL
} from "../actions/chapter_form"
import { TOGGLE_CAMERA_ROLL_MODAL, UPDATE_ACTIVE_VIEW } from "../actions/camera_roll"
import _ from "lodash"

const defaultCameraRollData = {
  visible: false,
  activeView: ""
}

export default (state = defaultCameraRollData, action) => {
  switch (action.type) {
    case TOGGLE_CAMERA_ROLL_MODAL:
      return {
        ...state,
        visible: action.payload
      }
    case UPDATE_ACTIVE_VIEW:
      return {
        ...state,
        activeView: action.payload
      }
    default:
      return state
  }
}
