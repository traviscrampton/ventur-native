import { EDIT_TEXT, UPDATE_FORMAT_BAR, CREATE_NEW_ENTRY, DELETE_ENTRY } from "actions/action_types"

const defaultTextData = {
  entries: [
    {
      markdown: "",
      content: "hello word",
      styles: { fontSize: 30, fontWeight: "700" }
    },
    {
      markdown: "",
      content: "I'm a big doggy",
      styles: {}
    }
  ],
  activeAttributes: {}
}

export default (state = defaultTextData, action) => {
  switch (action.type) {
    case UPDATE_FORMAT_BAR:
      return {
        ...state,
        activeAttributes: action.payload
      }
    case EDIT_TEXT:
      const { index, entry } = action.payload
      return {
        ...state,
        entries: [...state.entries.slice(0, index), entry, ...state.entries.slice(index + 1)]
      }
    case CREATE_NEW_ENTRY:
      const { newIndex, newEntry } = action.payload
      return {
        ...state,
        entries: [...state.entries.slice(0, newIndex), newEntry, ...state.entries.slice(newIndex)]
      }
    case DELETE_ENTRY:
      return {
        ...state,
        entries: [...state.entries.slice(0, action.payload), ...state.entries.slice(action.payload + 1)]
      }
    default:
      return state
  }
}
