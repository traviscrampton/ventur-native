export function editEntry(payload) {
  return {
    type: "EDIT_ENTRY",
    payload: payload
  }
}

export function updateManageContentEntries(payload) {
  return {
    type: "UPDATE_MANAGE_CONTENT_ENTRIES",
    payload: payload
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
    type: "UPDATE_ENTRIES_ORDER",
  }
}

export function prepManageContent() {
  return {
    type: "PREP_MANAGE_CONTENT"
  }
}

export function updateImageCaption(payload) {
  return function(dispatch, getState) {
    dispatch(editEntry(payload))
    dispatch(updateActiveImageCaption(""))
    dispatch(updateActiveIndex(null))
  }
}

export function addImagesToEntries(payload) {
  return {
    type: "ADD_IMAGES_TO_ENTRIES",
    payload: payload
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

export function updateActiveCreator(payload) {
  return {
    type: "UPDATE_ACTIVE_CREATOR",
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
    dispatch(deleteEntry(payload))
    dispatch(updateActiveIndex(null))
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

export function updateCursorPosition(payload) {
  return { type: "UPDATE_CURSOR_POSITION", payload: payload }
}
