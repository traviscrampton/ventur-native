import { UPDATE_CHAPTER_FORM, RESET_CHAPTER_FORM } from "actions/chapter_form"

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
  content: [],
  journals: [],
  user: {}
}

export default (state = defaultChapterFormData, action) => {
  switch (action.type) {
    case UPDATE_CHAPTER_FORM:
      return Object.assign({}, state, action.payload)
    case RESET_CHAPTER_FORM:
      return defaultChapterFormData
    default:
      return state
  }
}
