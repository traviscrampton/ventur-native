export function editText(payload) {
  return {
    type: "EDIT_TEXT",
    payload: payload
  }
}

export function updateFocusAndFormat(payload) {
  return function(dispatch) {
    dispatch(updateEntryFocus(payload.index))
    dispatch(updateFormatBar(payload.style))
  }
}

export function updateEntryFocus(payload) {
  return {
    type: "UPDATE_ENTRY_FOCUS",
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
  const { oldPayload, index } = payload
  return function(dispatch) {
    dispatch(editText(oldPayload))
    dispatch(deleteEntry(index))
  }
}

export function handleReturnKey(payload) {
  const { oldPayload, newPayload } = payload
  return function(dispatch) {
    dispatch(editText(oldPayload))
    dispatch(createNewEntry(newPayload))
  }
}
