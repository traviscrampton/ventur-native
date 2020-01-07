import _ from 'lodash';
import { post } from '../agent';
import { populateComments } from './comments';

export const POPULATE_COMMENT_FORM = 'POPULATE_COMMENT_FORM';
export function populateCommentForm(payload) {
  return {
    type: POPULATE_COMMENT_FORM,
    payload
  };
}

export const TOGGLE_COMMENT_FORM_MODAL = 'TOGGLE_COMMENT_FORM_MODAL';
export function toggleCommentFormModal(payload) {
  return {
    type: TOGGLE_COMMENT_FORM_MODAL,
    payload
  };
}

export const RESET_COMMENT_FORM = 'RESET_COMMENT_FORM';
export function resetCommentForm(payload) {
  return {
    type: RESET_COMMENT_FORM,
    payload
  };
}

export const UPDATE_COMMENT_CONTENT = 'UPDATE_COMMENT_CONTENT';
export function updateCommentContent(payload) {
  return {
    type: UPDATE_COMMENT_CONTENT,
    payload
  };
}

export const ADD_TOP_LEVEL_COMMENT = 'ADD_TOP_LEVEL_COMMENT';
export function addTopLevelComment(payload) {
  return {
    type: ADD_TOP_LEVEL_COMMENT,
    payload
  };
}

export function addNestedComment(commentable, comments, newComment) {
  const parsedComment = _.omit(newComment, 'subComments');
  return comments.map(comment => {
    if (comment.id === commentable.commentableId) {
      const subComments = [...comment.subComments, parsedComment];
      comment.subComments = subComments;
    }

    return comment;
  });
}

export function createComment() {
  return function(dispatch, getState) {
    const { commentable, content } = getState().commentForm;
    const { comments } = getState().comments;

    if (content.length === 0) return;

    const params = {
      commentableType: commentable.commentableType,
      commentableId: commentable.commentableId,
      content
    };

    post('/comments', params).then(data => {
      if (commentable.commentableType !== 'comment') {
        dispatch(addTopLevelComment(data.comment));
      } else {
        const newCommentSet = addNestedComment(
          commentable,
          comments,
          data.comment
        );
        dispatch(populateComments(newCommentSet));
      }
    });
  };
}
