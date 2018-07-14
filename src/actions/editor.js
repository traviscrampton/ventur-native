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
