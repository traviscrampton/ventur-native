import { get, destroy } from "../agent";

export function loadComments(params) {
  return function(dispatch, getState) {
    get(`/comments`, params).then(data => {
      dispatch(populateComments(data.comments));
    });
  };
}

export const POPULATE_COMMENTS = "POPULATE_COMMENTS";
export function populateComments(payload) {
  return {
    type: POPULATE_COMMENTS,
    payload: payload
  };
}

function filterDeletedComment(comments, data) {
  let filteredSubComments;
  if (data.commentable_type !== "Comment") {
    return comments.filter(comment => {
      return comment.id !== data.id;
    });
  } else {
    return comments.map((comment, index) => {
      filteredSubComments = comment.subComments.filter(subComment => {
        return subComment.id !== data.id;
      });
      comment.subComments = filteredSubComments;
      return comment;
    });
  }
}

export function deleteComment(id) {
  return function(dispatch, getState) {
    destroy(`/comments/${id}`).then(data => {
      let { comments } = getState().comments;
      const filteredComments = filterDeletedComment(comments, data);
      dispatch(populateComments(filteredComments));
    });
  };
}
