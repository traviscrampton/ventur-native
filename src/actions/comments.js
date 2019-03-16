import { get } from "agent"

export const LOAD_COMMENTS = "LOAD_COMMENTS"
export function loadComments(params) {
  get(`/comments`, params).then(data => {
    return {
      type: LOAD_COMMENTS,
      payload: data.comments
    }
  })
}
