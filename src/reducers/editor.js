import _ from "lodash"

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
      content: "",
      styles: "",
      type: "text"
    },
    {
      caption: "",
      type: "image",
      uri: "assets-library://asset/asset.PNG?id=F3152360-1A07-485A-AE48-B5DFEEE1E6B5&ext=PNG"
    },
    {
      caption: "",
      type: "image",
      uri: "assets-library://asset/asset.PNG?id=02E71585-C14D-402E-B601-33B5270D95D4&ext=PNG"
    },
    {
      caption: "",
      type: "image",
      uri: "assets-library://asset/asset.PNG?id=E2704100-7084-4C24-BAB2-B149B20AE94F&ext=PNG"
    }
  ],
  activeIndex: 0,
  toolbarOptions: ["H1", "text", "QUOTE"],
  activeContentCreator: null,
  keyboardShowing: false,
  selectedImages: [],
  activeCaption: "",
  newIndex: null,
  manageContentEntries: [],
  entriesSortBase: []
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
      console.log(
        _.flatten([
          ...state.entries.slice(0, action.payload),
          state.selectedImages,
          ...state.entries.slice(action.payload)
        ])
      )
      return {
        ...state,
        selectedImages: [],
        activeIndex: null,
        activeContentCreator: null,
        entries: _.flatten([
          ...state.entries.slice(0, action.payload),
          state.selectedImages,
          ...state.entries.slice(action.payload)
        ])
        // entries: _.flatten(Object.assign([], state.entries, { [action.payload]: state.selectedImages }))
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

    default:
      return state
  }
}
