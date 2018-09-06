export const LOADED_CHAPTER = "LOADED_CHAPTER"
export function loadChapter(payload) {
  return {
    type: LOADED_CHAPTER,
    payload: payload
  }
}

export const RESET_CHAPTER = "RESET_CHAPTER"
export function resetChapter() {
  return {
    type: RESET_CHAPTER
  }
}
