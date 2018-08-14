import {
  EDIT_ENTRY,
  UPDATE_FORMAT_BAR,
  CREATE_NEW_ENTRY,
  DELETE_ENTRY,
  UPDATE_ACTIVE_INDEX,
  UPDATE_KEYBOARD_STATE,
  UPDATE_ACTIVE_CREATOR,
  SET_SELECTED_IMAGES,
  ADD_IMAGES_TO_ENTRIES,
  UPDATE_ACTIVE_IMAGE_CAPTION,
  SET_NEXT_INDEX_NULL,
  PREP_MANAGE_CONTENT,
  UPDATE_MANAGE_CONTENT_ENTRIES,
  UPDATE_ENTRIES_ORDER,
  REMOVE_ENTRY_FROM_CLONE
} from "actions/action_types"

const defaultTextData = {
  activeAttribute: "",
  entries: [
    {
      type: "text",
      content: "Mexico",
      styles: "H1",
      height: ""
    },
    {
      type: "text",
      content: "There was nothing to see here ther was nothing to see there ",
      styles: "",
      height: ""
    },
    {
      type: "text",
      content: "Spinach broccoli was not the ideal dinner",
      styles: "",
      height: ""
    },
    {
      type: "text",
      content: "I hope you like jammin too",
      styles: "",
      height: ""
    },
    {
      type: "text",
      content: "If somebody stope me once",
      styles: "",
      height: ""
    },
    {
      type: "text",
      content: "If anybody crosses me i'm going to jimmy jammy once",
      styles: "",
      height: ""
    },
    {
      type: "text",
      content: "Did ludacris die for my sins",
      styles: "",
      height: ""
    }
  ],
  activeIndex: 0,
  toolbarOptions: ["H1", "QUOTE"],
  activeContentCreator: null,
  keyboardShowing: false,
  selectedImages: [],
  activeCaption: "",
  newIndex: null,
  manageContentEntries: [],
  entriesSortBase: []
}

export default (state = defaultTextData, action) => {
  switch (action.type) {
    case UPDATE_FORMAT_BAR:
      return {
        ...state,
        activeAttribute: action.payload
      }
    case UPDATE_ENTRIES_ORDER:
      return {
        ...state,
        entries: [...state.manageContentEntries],
        manageContentEntries: [],
        entriesSortBase: []
      }
    case UPDATE_MANAGE_CONTENT_ENTRIES:
      return {
        ...state,
        manageContentEntries: action.payload
      }

    case REMOVE_ENTRY_FROM_CLONE:
      const newArray = [
        ...state.entriesSortBase.slice(0, action.payload),
        ...state.entriesSortBase.slice(action.payload + 1)
      ]
      return {
        ...state,
        entriesSortBase: newArray,
        manageContentEntries: newArray
      }

    case PREP_MANAGE_CONTENT:
      return {
        ...state,
        manageContentEntries: [...state.entries],
        entriesSortBase: [...state.entries]
      }

    case UPDATE_ACTIVE_IMAGE_CAPTION:
      return {
        ...state,
        activeCaption: action.payload
      }

    case SET_SELECTED_IMAGES:
      return {
        ...state,
        selectedImages: action.payload
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
        activeIndex: null,
        activeContentCreator: null,
        entries: [
          ...state.entries.slice(0, action.payload),
          state.selectedImages,
          ...state.entries.slice(action.payload)
        ].reduce((a, b) => a.concat(b), [])
      }

    case UPDATE_KEYBOARD_STATE:
      return {
        ...state,
        keyboardShowing: action.payload
      }
    case SET_NEXT_INDEX_NULL:
      return {
        ...state,
        newIndex: null
      }

    case EDIT_ENTRY:
      let { index, entry } = action.payload
      return {
        ...state,
        entries: [...state.entries.slice(0, index), entry, ...state.entries.slice(index + 1)]
      }

    case CREATE_NEW_ENTRY:
      const { newIndex, newEntry } = action.payload
      return {
        ...state,
        entries: [...state.entries.slice(0, newIndex), newEntry, ...state.entries.slice(newIndex)],
        newIndex: newIndex
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
