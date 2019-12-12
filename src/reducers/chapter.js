import {
  LOADED_CHAPTER,
  RESET_CHAPTER,
  SET_EDIT_MODE
} from "../actions/chapter";

const defaultChapterData = {
  chapter: {
    journal: {},
    editorBlob: {
      id: null,
      content: []
    },
    user: {}
  },
  loaded: false,
  editMode: false
};

export default (state = defaultChapterData, action) => {
  switch (action.type) {
    case LOADED_CHAPTER:
      return {
        ...state,
        chapter: action.payload,
        loaded: true
      };
    case SET_EDIT_MODE:
      return {
        ...state,
        editMode: action.payload
      };
    case RESET_CHAPTER:
      return defaultChapterData;
    default:
      return state;
  }
};
