import {
  EDIT_TEXT,
  UPDATE_FORMAT_BAR,
  CREATE_NEW_ENTRY,
  DELETE_ENTRY,
  UPDATE_ENTRY_FOCUS,
  TEXT_TO_INPUT,
  UPDATE_CURSOR_POSITION,
  UPDATE_ACTIVE_INDEX,
  UPDATE_CONTAINER_HEIGHT,
  SET_NEXT_INDEX_NULL
} from "actions/action_types"

const defaultTextData = {
  activeAttribute: "",
  entries: [
    {
      content: "The Argentine side of patagonia",
      styles: "H1",
      height: 50
    },
    {
      content: "Do not ask what you have done for your country",
      styles: "QUOTE-2",
      height: 50
    }
  ],
  activeIndex: null,
  isDeleting: false,
  toolbarOptions: ["H1", "QUOTE"],
  cursorPosition: 0
}

export default (state = defaultTextData, action) => {
  switch (action.type) {
    case UPDATE_FORMAT_BAR:
      return {
        ...state,
        activeAttribute: action.payload
      }

    case SET_NEXT_INDEX_NULL:
      return {
        ...state,
        nextIndex: null
      }

    case UPDATE_ACTIVE_INDEX:
      return {
        ...state,
        activeIndex: action.payload
      }

    case UPDATE_CONTAINER_HEIGHT:
      return {
        ...state,
        containerHeight: action.payload
      }

    case EDIT_TEXT:
      let { index, entry } = action.payload
      return {
        ...state,
        entries: [...state.entries.slice(0, index), entry, ...state.entries.slice(index + 1)]
      }

    case TEXT_TO_INPUT:
      return {
        ...state,
        activeIndex: action.payload
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

    case UPDATE_CURSOR_POSITION:
      return {
        ...state,
        cursorPosition: action.payload
      }

    default:
      return state
  }
}
