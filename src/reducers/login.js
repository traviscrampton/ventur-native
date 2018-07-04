import { UPDATE_LOGIN_FORM } from "actions/action_types"

const defaultLoginForm = {
  email: "",
  password: ""
}

export default (state = defaultLoginForm, action) => {
  switch (action.type) {
    case UPDATE_LOGIN_FORM:
      return {
        ...state,
        [action.key]: action.value
      }
    default:
      return state
  }
}
