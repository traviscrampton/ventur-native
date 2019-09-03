import { UPDATE_CHAPTER_FORM, RESET_CHAPTER_FORM, TOGGLE_CHAPTER_MODAL } from "../actions/chapter_form"
import { TOGGLE_CAMERA_ROLL_MODAL } from "../actions/camera_roll"
import _ from "lodash"

const defaultCameraRollData = {
  visible: false
}

export default (state = defaultCameraRollData, action) => {
  switch (action.type) {
    case TOGGLE_CAMERA_ROLL_MODAL:
      return {
        ...state,
        visible: action.payload
      }
    default:
      return state
  }
}
