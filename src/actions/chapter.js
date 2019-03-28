function convertToJson(str) {
  if (typeof str === "string") {
    return JSON.parse(str)
  } else {
    return str
  }
}

export const LOADED_CHAPTER = "LOADED_CHAPTER"
export function loadChapter(payload) {
  let chapter = payload
  chapter.editorBlob.content = convertToJson(payload.editorBlob.content)

  return {
    type: LOADED_CHAPTER,
    payload: chapter
  }
}

export const RESET_CHAPTER = "RESET_CHAPTER"
export function resetChapter() {
  return {
    type: RESET_CHAPTER
  }
}

export const SET_EDIT_MODE = "SET_EDIT_MODE"
export function setEditMode(payload) {
  return {
    type: SET_EDIT_MODE,
    payload: payload
  }
}
