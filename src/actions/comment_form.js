import { post } from "agent"
import _ from "lodash"
import { populateComments } from "actions/comments"

export const POPULATE_COMMENT_FORM = "POPULATE_COMMENT_FORM"
export function populateCommentForm(payload) {
  console.log("payload in the action", payload)
  return {
    type: POPULATE_COMMENT_FORM,
    payload: payload
  }
}

export const RESET_COMMENT_FORM = "RESET_COMMENT_FORM"
export function resetCommentForm(payload) {
  return {
    type: RESET_COMMENT_FORM,
    payload: payload
  }
}

export const UPDATE_COMMENT_CONTENT = "UPDATE_COMMENT_CONTENT"
export function updateCommentContent(payload) {
  return {
    type: UPDATE_COMMENT_CONTENT,
    payload: payload
  }
}

export const ADD_TOP_LEVEL_COMMENT = "ADD_TOP_LEVEL_COMMENT"
export function addTopLevelComment(payload) {
  return {
    type: ADD_TOP_LEVEL_COMMENT,
    payload: payload
  }
}

export function addNestedComment(commentable, comments, newComment) {
  let parsedComment = _.omit(newComment, "subComments")
  return comments.map((comment, index) => {
    if (comment.id === commentable.commentableId) {
      let subComments = [...comment.subComments, parsedComment]
      comment.subComments = subComments
    }

    return comment
  })
}

export function createComment() {
  return function(dispatch, getState) {
    const { commentable, content } = getState().commentForm
    const { comments } = getState().comments

    const params = {
      commentableType: commentable.commentableType,
      commentableId: commentable.commentableId,
      content: content
    }

    post(`/comments`, params).then(data => {
      if (commentable.commentableType !== "comment") {
        dispatch(addTopLevelComment(data.comment))
      } else {
        let newCommentSet = addNestedComment(commentable, comments, data.comment)
        dispatch(populateComments(newCommentSet))
      }
    })
  }
}
