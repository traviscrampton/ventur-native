import {
  EDIT_ENTRY,
  UPDATE_FORMAT_BAR,
  CREATE_NEW_ENTRY,
  DELETE_ENTRY,
  UPDATE_ENTRY_FOCUS,
  TEXT_TO_INPUT,
  UPDATE_CURSOR_POSITION,
  UPDATE_ACTIVE_INDEX,
  UPDATE_CONTAINER_HEIGHT,
  SET_NEXT_INDEX_NULL,
  UPDATE_ACTIVE_CREATOR,
  SET_SELECTED_IMAGES,
  ADD_IMAGES_TO_ENTRIES,
  UPDATE_ACTIVE_IMAGE_CAPTION
} from "actions/action_types"

const defaultTextData = {
  activeAttribute: "",
  entries: [
    {
      type: "text",
      content: "The Argentine side of patagonia",
      styles: "H1"
    },
    {
      type: "text",
      content: "Do not ask what you have done for your country",
      styles: "QUOTE-2"
    }
  ],
  activeIndex: null,
  isDeleting: false,
  toolbarOptions: ["H1", "QUOTE"],
  cursorPosition: 0,
  activeContentCreator: null,
  selectedImages: [],
  activeCaption: ""
}

export default (state = defaultTextData, action) => {
  switch (action.type) {
    case UPDATE_FORMAT_BAR:
      return {
        ...state,
        activeAttribute: action.payload
      }

    case UPDATE_ACTIVE_IMAGE_CAPTION:
    console.log("ACTION IMAGE CAPTION REDUCER", action.payload)
      return {
        ...state,
        activeCaption: action.payload
      }

    case SET_SELECTED_IMAGES:
      return {
        ...state,
        selectedImages: action.payload
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

    case UPDATE_ACTIVE_CREATOR:
      return {
        ...state,
        activeContentCreator: action.payload
      }

    case ADD_IMAGES_TO_ENTRIES:
      return {
        ...state,
        selectedImages: [],
        activeContentCreator: null,
        entries: [
          ...state.entries.slice(0, action.payload),
          state.selectedImages,
          ...state.entries.slice(action.payload)
        ].reduce((a, b) => a.concat(b), [])
      }

    case UPDATE_CONTAINER_HEIGHT:
      return {
        ...state,
        containerHeight: action.payload
      }

    case EDIT_ENTRY:
      let { index, entry } = action.payload
      console.log(" EDIT ENTRY HAS BEEN HIT", entry)
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
