import _ from "lodash"
import { setToken, API_ROOT } from "agent"
import DropDownHolder from "utils/DropdownHolder"
import { loadChapter, setEditMode } from "actions/chapter"
import { resetChapterForm, addChapterToJournals } from "actions/chapter_form"
import { populateOfflineChapters, dispatch } from "actions/user"
import { persistChapterToAsyncStorage, useLocalStorage } from "utils/offline_helpers"
import { CameraRoll, NetInfo } from "react-native"

export function editEntry(payload) {
  return function(dispatch, getState) {
    dispatch(updateEntryState(payload))
  }
}

export function updateEntryState(payload) {
  return {
    type: "EDIT_ENTRY",
    payload: payload
  }
}

export function loseChangesAndUpdate(payload) {
  return function(dispatch, getState) {
    dispatch(startUpdating())
    updateBackToDraft(payload.id, payload.deletedIds, dispatch)
  }
}

export const updateBackToDraft = async (id, deletedIds, dispatch) => {
  let selectedImage
  const formData = new FormData()
  const token = await setToken()

  if (deletedIds && deletedIds.length > 0) {
    formData.append("deletedIds", JSON.stringify(deletedIds))
  }

  fetch(`${API_ROOT}/editor_blobs/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: token
    },
    body: formData
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      if (data.errors) {
        throw Error(data.errors.join(", "))
      }

      dispatch(setEditMode(false))
      dispatch(resetDeletedIds())
      dispatch(populateEntries([]))
      dispatch(doneUpdating())
    })
    .catch(err => {
      dispatch(doneUpdating())
      DropDownHolder.alert("error", "Error", err)
    })
}

export function doneEditingAndPersist() {
  return function(dispatch, getState) {
    dispatch(startUpdating())
    const { entries, deletedIds } = getState().editor
    const { chapter } = getState().chapter
    finalizeDraft(chapter.editorBlob.id, entries, deletedIds, chapter, dispatch)
  }
}

export const finalizeDraft = async (id, entries, deletedIds, chapter, dispatch) => {
  let selectedImage
  const formData = new FormData()
  const token = await setToken()
  if (deletedIds.length > 0) {
    formData.append("deletedIds", JSON.stringify(deletedIds))
  }

  formData.append("content", JSON.stringify(entries))
  fetch(`${API_ROOT}/editor_blobs/${id}/update_blob_done`, {
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: token
    },
    body: formData
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      if (data.errors) {
        throw Error(data.errors.join(", "))
      }

      let updatedChapter = Object.assign({}, chapter, {
        editorBlob: { id: data.id, content: JSON.parse(data.content) }
      })

      dispatch(loadChapter(updatedChapter))
      dispatch(resetDeletedIds())
      dispatch(setEditMode(false))
      dispatch(populateEntries([]))
      dispatch(doneUpdating())
    })
    .catch(err => {
      dispatch(doneUpdating())
      DropDownHolder.alert("error", "Error", err)
    })
}

export function updateImagesState(payload) {
  const updatedImages = payload.images.map(img => {
    return {
      id: img.id,
      filename: img.filename,
      localUri: img.uri,
      uri: img.uri,
      type: "image",
      aspectRatio: img.height / img.width,
      caption: ""
    }
  })

  payload.images = updatedImages
  return {
    type: "ADD_IMAGES_TO_ENTRIES",
    payload: payload
  }
}

export const UPLOAD_IS_IMAGE = "UPLOAD_IS_IMAGE"
export const uploadIsImage = isImage => {
  return {
    type: UPLOAD_IS_IMAGE,
    payload: isImage
  }
}

export const startImageUploading = () => {
  return function(dispatch, getState) {
    dispatch(startUpdating())
    dispatch(uploadIsImage(true))
  }
}

export function addImagesToEntries(payload) {
  return function(dispatch, getState) {
    dispatch(startImageUploading())
    dispatch(updateImagesState(payload))
    debouncePersist(getState().editor.entries, getState().editor.uploadIsImage, getState().chapter.chapter, dispatch)
  }
}

export function storeChapterToOfflineMode(payload) {
  return (dispatch, getState) => {
    saveImagesToCameraRoll(payload, dispatch)
  }
}

export const saveImagesToCameraRoll = async (payload, dispatch) => {
  for (let img of payload) {
    CameraRoll.saveToCameraRoll(img.entry.uri, "photo").then(uri => {
      entry = Object.assign(img.entry, { localUri: uri })
      dispatch(updateEntryState({ entry: entry, index: img.index }))
    })
  }
}

export function dispatchPopulateOfflineChapters(payload) {
  return (dispatch, getState) => {
    dispatch(populateOfflineChapters(payload))
  }
}

export const SET_INITAL_IMAGE_IDS = "SET_INITAL_IMAGE_IDS"
export const setInitalImageIds = ids => {
  return {
    type: SET_INITAL_IMAGE_IDS,
    payload: ids
  }
}

export const RESET_DELETED_IDS = "RESET_DELETED_IDS"
export const resetDeletedIds = () => {
  return {
    type: RESET_DELETED_IDS
  }
}

export const getInitialImageIds = entries => {
  return function(dispatch, getState) {
    let imageIds = entries
      .filter(entry => entry.type === "image" && entry.id)
      .map(entry => {
        return entry.id
      })
    dispatch(setInitalImageIds(imageIds))
  }
}

export const saveEditorContent = async (entries, imageUpload, chapter, dispatch) => {
  let selectedImage
  const formData = new FormData()
  const token = await setToken()
  const newImages = entries.filter(entry => {
    return entry.type === "image" && entry.id === null
  })
  if (newImages) {
    for (let image of newImages) {
      selectedImage = {
        uri: image.uri,
        name: image.filename,
        type: "multipart/form-data"
      }
      formData.append("files[]", selectedImage)
    }
  }
  formData.append("content", JSON.stringify(entries))
  fetch(`${API_ROOT}/editor_blobs/${chapter.editorBlob.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: token
    },
    body: formData
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      if (data.errors) {
        throw Error(data.errors.join(", "))
      }
      if (imageUpload) {
        dispatch(populateEntries(JSON.parse(data.content)))
        dispatch(uploadIsImage(false))
      }
      dispatch(doneUpdating())
    })
    .catch(err => {
      dispatch(doneUpdating())
      DropDownHolder.alert("error", "Error", err)
    })
}

export const editChapterOfflineMode = async (chapter, offline, dispatch) => {
  const token = await setToken()
  let params = { id: chapter.id, offline: offline }
  fetch(`${API_ROOT}/chapters/${params.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify(params)
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      if (data.errors) {
        throw Error(data.errors.join(", "))
      }
      dispatch(loadChapter(data))
    })
    .catch(err => {
      DropDownHolder.alert("error", "Error", err)
    })
}

export const ADD_IMAGE_TO_DELETED_IDS = "ADD_IMAGE_TO_DELETED_IDS"
export const addImageToDeletedIds = imageId => {
  console.log("addImageTODeletedIds", imageId)
  return {
    type: ADD_IMAGE_TO_DELETED_IDS,
    payload: imageId
  }
}


export const dispatchPersist = async (entries, imageUpload, chapter, dispatch) => {
  saveEditorContent(entries, imageUpload, chapter, dispatch)
}

export function updateManageContentEntries(payload) {
  return {
    type: "UPDATE_MANAGE_CONTENT_ENTRIES",
    payload: payload
  }
}

export const DONE_UPDATING = "DONE_UPDATING"
export function doneUpdating() {
  return {
    type: DONE_UPDATING
  }
}

export const START_UPDATING = "START_UPDATING"
export function startUpdating() {
  return {
    type: START_UPDATING
  }
}

export function removeEntryFromClone(payload) {
  return {
    type: "REMOVE_ENTRY_FROM_CLONE",
    payload: payload
  }
}

export function updateEntriesOrder() {
  return {
    type: "UPDATE_ENTRIES_ORDER"
  }
}

export function prepManageContent() {
  return {
    type: "PREP_MANAGE_CONTENT"
  }
}

export function updateImageCaption(payload) {
  return function(dispatch, getState) {
    dispatch(startUpdating())
    dispatch(editEntry(payload))
    dispatch(updateActiveImageCaption(""))
    dispatch(updateActiveIndex(null))
    debouncePersist(getState().editor.entries, getState().editor.deletedIds, getState().chapter.chapter, dispatch)
  }
}

export function updateActiveImageCaption(payload) {
  return {
    type: "UPDATE_ACTIVE_IMAGE_CAPTION",
    payload: payload
  }
}

export function setSelectedImages(payload) {
  return {
    type: "SET_SELECTED_IMAGES",
    payload: payload
  }
}

export function getCameraRollPhotos(payload) {
  return {
    type: "GET_CAMERA_ROLL_PHOTOS",
    payload: payload
  }
}

export const UPDATE_ACTIVE_CREATOR = "UPDATE_ACTIVE_CREATOR"
export function updateActiveCreator(payload) {
  return {
    type: UPDATE_ACTIVE_CREATOR,
    payload: payload
  }
}

export function setNextIndexNull() {
  return {
    type: "SET_NEXT_INDEX_NULL",
    payload: null
  }
}

export function updateKeyboardState(payload) {
  return {
    type: "UPDATE_KEYBOARD_STATE",
    payload: payload
  }
}

export function updateFormatBar(payload) {
  return {
    type: "UPDATE_FORMAT_BAR",
    payload: payload
  }
}

export function createNewTextEntry(payload) {
  let { newEntry, newIndex } = payload

  return function(dispatch, getState) {
    dispatch(createNewEntry(payload))
    dispatch(updateActiveIndex(newIndex))
  }
}

export function createNewEntry(payload) {
  return {
    type: "CREATE_NEW_ENTRY",
    payload: payload
  }
}

export function removeEntryAndFocus(payload) {
  return function(dispatch, getState) {
    dispatch(startUpdating())
    dispatch(deleteEntry(payload))
    dispatch(updateActiveIndex(null))
    debouncePersist(getState().editor.entries, getState().editor.deletedIds, getState().chapter.chapter, dispatch)
  }
}

export function deleteEntry(payload) {
  return {
    type: "DELETE_ENTRY",
    payload: payload
  }
}

export function deleteWithEdit(payload) {
  const { oldPayload, index, cursorPosition, instance } = payload
  return function(dispatch, getState) {
    dispatch(editText(oldPayload))
    dispatch(deleteEntry(index))
    dispatch(updateActiveIndex(index))
    dispatch(updateCursorPosition(cursorPosition))
  }
}

export function turnTextToTextInput(payload) {
  return function(dispatch, getState) {
    dispatch(updateTextInput(payload))
    dispatch(updateFormatBar(getState().editor.entries[payload].styles))
  }
}

export function updateTextInput(payload) {
  return {
    type: "TEXT_TO_INPUT",
    payload: payload
  }
}

export function updateActiveIndex(payload) {
  return {
    type: "UPDATE_ACTIVE_INDEX",
    payload: payload
  }
}

export function handleReturnKey(payload) {
  const { oldPayload, newPayload, instance } = payload
  return function(dispatch) {
    dispatch(editText(oldPayload))
    dispatch(createNewEntry(newPayload))
    dispatch(updateActiveIndex(newPayload.newIndex))
    dispatch(updateCursorPosition(0))
  }
}

export const SET_INITIAL_EDITOR_STATE = "SET_INITIAL_EDITOR_STATE"
export function setInitialEditorState(payload) {
  return {
    type: "SET_INITIAL_EDITOR_STATE"
  }
}

export const POPULATE_ENTRIES = "POPULATE_ENTRIES"
export function populateEntries(payload) {
  return {
    type: "POPULATE_ENTRIES",
    payload: payload
  }
}

export function updateCursorPosition(payload) {
  return { type: "UPDATE_CURSOR_POSITION", payload: payload }
}
export const debouncePersist = _.debounce(dispatchPersist, 2000)
