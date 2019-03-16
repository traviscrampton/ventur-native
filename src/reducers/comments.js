import { LOAD_COMMENTS } from "actions/comments"

const defaultCommentsData = {
  comments: []
}


export default (state = defaultCommentsData, action) => {
  switch (action.type) {
    case LOAD_COMMENTS:
    console.log('loaded! from reducers')
      return {
        ...state,
        comments: action.payload
      }
    default:
      return state
  }
}
