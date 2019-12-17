import {
  UPDATE_USER_FORM,
  POPULATE_USER_FORM,
  RESET_USER_FORM,
  TOGGLE_USER_FORM_MODAL
} from '../actions/user_form';

const defaultUserForm = {
  id: null,
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  avatar: {},
  visible: false
};

export default (state = defaultUserForm, action) => {
  switch (action.type) {
    case UPDATE_USER_FORM:
      return {
        ...state,
        [action.payload.key]: action.payload.text
      };
    case TOGGLE_USER_FORM_MODAL:
      return {
        ...state,
        visible: action.payload
      };

    case RESET_USER_FORM:
      return defaultUserForm;

    case POPULATE_USER_FORM:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
