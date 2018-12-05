import { UPDATE_CHAPTER_FORM, RESET_CHAPTER_FORM } from "actions/chapter_form"
import _ from "lodash"

const defaultChapterFormData = {
  id: null,
  journalId: null,
  bannerImage: { uri: "" },
  title: "",
  journal: {},
  offline: false,
  distance: 0,
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
  user: {}
}

const chapterFormResetData = _.omit(defaultChapterFormData, "journals")

export default (state = defaultChapterFormData, action) => {
  switch (action.type) {
    case UPDATE_CHAPTER_FORM:
      return Object.assign({}, state, action.payload)
    case RESET_CHAPTER_FORM:
      return Object.assign({}, state, chapterFormResetData)

    default:
      return state
  }
}
