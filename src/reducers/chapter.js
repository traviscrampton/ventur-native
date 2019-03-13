import { LOADED_CHAPTER, RESET_CHAPTER_TAB } from "actions/chapter"

const defaultChapterData = {
  chapter: {
    editorBlob: {
      id: null,
      content: []
    }
  },
  loaded: false
}

export default (state = defaultChapterData, action) => {
  switch (action.type) {
    case LOADED_CHAPTER:
      return {
        ...state,
        chapter: action.payload,
        loaded: true
      }
    case RESET_CHAPTER_TAB:
      return defaultChapterData
    default:
      return state
  }
}
