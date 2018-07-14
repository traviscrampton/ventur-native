import { EDIT_TEXT, UPDATE_FORMAT_BAR, CREATE_NEW_ENTRY, DELETE_ENTRY, UPDATE_ENTRY_FOCUS } from "actions/action_types"

const defaultTextData = {
  activeAttribute: "",
  entries: [
    {
      content: "hello word",
      styles: "H1"
    },
    {
      content: "I'm a big doggy",
      styles: "H2"
    }
  ],
  focusedEntryIndex: 0,
  toolbarOptions: ["H1", "H2", "QUOTE", "QUOTE-2"]
}

export default (state = defaultTextData, action) => {
  switch (action.type) {
    case UPDATE_ENTRY_FOCUS:
      return {
        ...state,
        focusedEntryIndex: action.payload
      }

    case UPDATE_FORMAT_BAR:
      return {
        ...state,
        activeAttribute: action.payload
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
