import { EDIT_TEXT, UPDATE_FORMAT_BAR, CREATE_NEW_ENTRY } from "actions/action_types"

const defaultTextData = {
  entries: [
    {
      markdown: "",
      content: "Hello World"
    },
    {
      markdown: "",
      content: "Hello Donald"
    },
    {
      markdown: "",
      content: "Hello Gabriel"
    }
  ],
  textObj: {}, // this is an array of objects
  markdownBlob: "",
  activeAttributes: ""
}

export default (state = defaultTextData, action) => {
  switch (action.type) {
    case UPDATE_FORMAT_BAR:
      return {
        ...state
      }
    case EDIT_TEXT:
      return {
        ...state,
        entries: action.payload
      }
    case CREATE_NEW_ENTRY:
      const { newIndex, newEntry } = action.payload
      return {
        ...state,
        entries: [...state.entries.slice(0, newIndex), newEntry, ...state.entries.slice(newIndex)]
      }
    default:
      return state
  }
}
