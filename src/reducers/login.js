import {
  UPDATE_LOGIN_FORM,
  TOGGLE_LOGIN_MODAL,
  RESET_LOGIN_FORM
} from '../actions/login';

const defaultLoginForm = {
  email: '',
  password: '',
  visible: false
};

export default (state = defaultLoginForm, action) => {
  switch (action.type) {
    case UPDATE_LOGIN_FORM:
      return {
        ...state,
        [action.payload.key]: action.payload.value
      };
    case TOGGLE_LOGIN_MODAL:
      return {
        ...state,
        visible: action.payload
      };
    case RESET_LOGIN_FORM:
      return defaultLoginForm;
    default:
      return state;
  }
};
