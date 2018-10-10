import { UPDATE_CHAPTER_FORM } from "actions/chapter_form"

const defaultChapterFormData = {
  id: null,
  journalId: null,
  bannerImage: { uri: "" },
  title: "",
  distance: 0,
  description: "",
}

export default (state = defaultChapterFormData, action) => {
  switch (action.type) {
    case UPDATE_CHAPTER_FORM:
      return Object.assign({}, state, action.payload)
    default:
      return state
  }
}
