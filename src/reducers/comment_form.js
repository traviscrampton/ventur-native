import {
  POPULATE_COMMENT_FORM,
  RESET_COMMENT_FORM,
  UPDATE_COMMENT_CONTENT,
  TOGGLE_COMMENT_FORM_MODAL
} from "../actions/comment_form";

const defaultCommentForm = {
  id: null,
  commentable: {
    commentableUser: {},
    commentableType: null,
    commentableId: null,
    title: ""
  },
  content: "",
  visible: false
};

export default (state = defaultCommentForm, action) => {
  switch (action.type) {
    case POPULATE_COMMENT_FORM:
      return Object.assign({}, state, action.payload);
    case UPDATE_COMMENT_CONTENT:
      return Object.assign({}, state, { content: action.payload });
    case RESET_COMMENT_FORM:
      return Object.assign({}, state, defaultCommentForm);
    case TOGGLE_COMMENT_FORM_MODAL:
      return Object.assign({}, state, { visible: action.payload });
    default:
      return state;
  }
};
