function convertToJson(str) {
  console.log(typeof str === "string")
  if (typeof str === "string") {
    return JSON.parse(str)
  } else {
    return str
  }
}

export const LOADED_CHAPTER = "LOADED_CHAPTER"
export function loadChapter(payload) {
  let chapter = payload
  chapter.content = convertToJson(payload.content)

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
