import { post, put, destroy } from "../agent"
import { addChapterToJournals } from "./chapter_form"

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

export const editChapterPublished = async (chapterId, published, dispatch) => {
  const data = await put(`/chapters/${chapterId}`, { published })

  dispatch(loadChapter(data.chapter))
  dispatch(addChapterToJournals(data.chapter))
}

export const SET_EDIT_MODE = "SET_EDIT_MODE"
export function setEditMode(payload) {
  return {
    type: SET_EDIT_MODE,
    payload: payload
  }
}

export const REMOVE_CHAPTER_FROM_STATE = "REMOVE_CHAPTER_FROM_STATE"
export const removeChapterFromState = chapter => {
  return {
    type: REMOVE_CHAPTER_FROM_STATE,
    payload: chapter
  }
}

export function sendEmails(chapterId) {
  return function(dispatch, getState) {
    kickOffEmails(chapterId, dispatch)
  }
}

export const deleteChapter = async (chapterId, callback, dispatch) => {
  const deletedChapter = await destroy(`/chapters/${chapterId}`)

  dispatch(removeChapterFromState(deletedChapter))
  callback()
}

export const kickOffEmails = async (chapterId, dispatch) => {
  const payload = await post(`/journal_follows/${chapterId}/send_chapter_emails`)
  console.log("IS THERE ANYTHING HERE?", payload)
  dispatch(loadChapter(payload.chapter))
}
