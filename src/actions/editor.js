export function editText(payload) {
  return {
    type: "EDIT_TEXT",
    payload: payload
  }
}

export function updateFormatBar(payload) {
  return {
    type: "UPDATE_FORMAT_BAR",
    payload: payload
  }
}

export function createNewEntry(payload) {
  return {
    type: "CREATE_NEW_ENTRY",
    payload: payload
  }
}

export function deleteEntry(payload) {
  return {
    type: "DELETE_ENTRY",
    payload: payload
  }
}

export function deleteWithEdit(payload) {
  const { oldPayload, index, cursorPosition } = payload
  return function(dispatch, getState) {
    dispatch(editText(oldPayload))
    dispatch(deleteEntry(index))
    dispatch(turnTextToTextInput(index - 1))
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

export function handleReturnKey(payload) {
  const { oldPayload, newPayload } = payload
  return function(dispatch) {
    dispatch(editText(oldPayload))
    dispatch(createNewEntry(newPayload))
    dispatch(turnTextToTextInput(newPayload.newIndex))
    dispatch(updateCursorPosition(0))
  }
}

export function updateCursorPosition(payload) {
  return { type: "UPDATE_CURSOR_POSITION", payload: payload }
}
