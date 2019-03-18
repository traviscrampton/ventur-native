import _ from "lodash"

import {
  EDIT_ENTRY,
  UPDATE_FORMAT_BAR,
  CREATE_NEW_ENTRY,
  DELETE_ENTRY,
  UPDATE_ACTIVE_INDEX,
  UPDATE_KEYBOARD_STATE,
  SET_SELECTED_IMAGES,
  ADD_IMAGES_TO_ENTRIES,
  UPDATE_ACTIVE_IMAGE_CAPTION,
  SET_NEXT_INDEX_NULL,
  PREP_MANAGE_CONTENT,
  UPDATE_MANAGE_CONTENT_ENTRIES,
  UPDATE_ENTRIES_ORDER,
  REMOVE_ENTRY_FROM_CLONE
} from "actions/action_types"

import {
  POPULATE_ENTRIES,
  DONE_UPDATING,
  START_UPDATING,
  SET_INITIAL_EDITOR_STATE,
  UPDATE_ACTIVE_CREATOR,
  ADD_IMAGE_TO_DELETED_IDS,
  RESET_DELETED_IDS,
  SET_INITAL_IMAGE_IDS,
  UPLOAD_IS_IMAGE
} from "actions/editor"

const defaultTextData = {
  activeAttribute: "",
  entries: [],
  deletedIds: [],
  initialImageIds: [],
  activeIndex: 0,
  toolbarOptions: ["H1", "QUOTE"],
  activeContentCreator: null,
  showEditorToolbar: false,
  selectedImages: [],
  activeCaption: "",
  newIndex: null,
  manageContentEntries: [],
  entriesSortBase: [],
  isUpdating: false,
  uploadIsImage: false
}
let newState
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
    case UPLOAD_IS_IMAGE:
      return {
        ...state,
        uploadIsImage: action.payload
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

    case ADD_IMAGE_TO_DELETED_IDS:
      return {
        ...state,
        deletedIds: [...state.deletedIds, action.payload]
      }

    case RESET_DELETED_IDS:
      return {
        ...state,
        deletedIds: []
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
    case START_UPDATING:
      return {
        ...state,
        isUpdating: true
      }

    case DONE_UPDATING:
      return {
        ...state,
        isUpdating: false
      }

    case SET_INITAL_IMAGE_IDS:
      return {
        ...state,
        initialImageIds: action.payload
      }

    case ADD_IMAGES_TO_ENTRIES:
      return {
        ...state,
        selectedImages: [],
        activeIndex: null,
        activeContentCreator: null,
        entries: _.flatten([
          ...state.entries.slice(0, action.payload.index),
          action.payload.images,
          ...state.entries.slice(action.payload.index)
        ])
      }
    case UPDATE_KEYBOARD_STATE:
      return {
        ...state,
        showEditorToolbar: action.payload
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
        entries: Object.assign([], state.entries, { [index]: entry })
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

    case POPULATE_ENTRIES:
      return {
        ...state,
        entries: action.payload
      }

    case SET_INITIAL_EDITOR_STATE:
      return defaultTextData

    default:
      return state
  }
}
