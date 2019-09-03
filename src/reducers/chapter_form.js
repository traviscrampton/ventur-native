import { UPDATE_CHAPTER_FORM, RESET_CHAPTER_FORM, TOGGLE_CHAPTER_MODAL } from "../actions/chapter_form"
import _ from "lodash"

const defaultChapterFormData = {
  id: null,
  journalId: null,
  bannerImage: { uri: "" },
  title: "",
  journal: {},
  offline: false,
  distance: 0,
  readableDistanceType: "",
  date: new Date(),
  readableDate: "",
  description: "",
  content: [
    {
      content: "",
      styles: "",
      type: "text"
    }
  ],
  journals: [],
  user: {},
  modalVisible: false
}

const chapterFormResetData = _.omit(defaultChapterFormData, "journals")

export default (state = defaultChapterFormData, action) => {
  switch (action.type) {
    case UPDATE_CHAPTER_FORM:
      return Object.assign({}, state, action.payload)
    case RESET_CHAPTER_FORM:
      return Object.assign({}, state, chapterFormResetData)
    case TOGGLE_CHAPTER_MODAL:
      return {
        ...state,
        modalVisible: action.payload
      }

    default:
      return state
  }
}
