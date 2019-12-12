import { POPULATE_COMMENTS } from "../actions/comments";
import { ADD_TOP_LEVEL_COMMENT } from "../actions/comment_form";

const defaultCommentsData = {
  comments: []
};

export default (state = defaultCommentsData, action) => {
  switch (action.type) {
    case POPULATE_COMMENTS:
      return {
        ...state,
        comments: action.payload
      };
    case ADD_TOP_LEVEL_COMMENT:
      return {
        ...state,
        comments: [...state.comments, action.payload]
      };
    default:
      return state;
  }
};
