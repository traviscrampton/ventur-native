import { UPDATE_USER_FORM, POPULATE_USER_FORM, RESET_USER_FORM } from "../actions/user_form"
const defaultUserForm = {
  id: null,
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  avatar: {}
}

export default (state = defaultUserForm, action) => {
  switch (action.type) {
    case UPDATE_USER_FORM:
      return {
        ...state,
        [action.payload.key]: action.payload.text
      }
      
    case RESET_USER_FORM:
      return defaultUserForm

    case POPULATE_USER_FORM:
      return Object.assign({}, state, action.payload)
    default:
      return state
  }
}
