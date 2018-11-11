export const UPDATE_CHAPTER_FORM = "UPDATE_CHAPTER_FORM"
export function updateChapterForm(payload) {
  return {
    type: UPDATE_CHAPTER_FORM,
    payload: payload
  }
}

export const RESET_CHAPTER_FORM = "RESET_CHAPTER_FORM"
export function resetChapterForm() {
  return {
    type: RESET_CHAPTER_FORM
  }
}
