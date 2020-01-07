import { post } from '../agent';
import { storeJWT } from '../auth';
import { setCurrentUser } from './common';

export const UPDATE_USER_FORM = 'UPDATE_USER_FORM';
export function updateUserForm(payload) {
  return {
    type: UPDATE_USER_FORM,
    payload
  };
}

export const POPULATE_USER_FORM = 'POPULATE_USER_FORM';
export function populateUserForm(payload) {
  return {
    type: POPULATE_USER_FORM,
    payload
  };
}

export const RESET_USER_FORM = 'RESET_USER_FORM';
export function resetUserForm() {
  return {
    type: RESET_USER_FORM
  };
}

export const TOGGLE_USER_FORM_MODAL = 'TOGGLE_USER_FORM_MODAL';
export function toggleUserFormModal(payload) {
  return {
    type: TOGGLE_USER_FORM_MODAL,
    payload
  };
}

export function submitForm() {
  return async function(dispatch, getState) {
    const { email, password, firstName, lastName } = getState().userForm;
    const params = {
      email,
      password,
      first_name: firstName,
      last_name: lastName
    };

    try {
      const data = await post('/users', params);
      const { user } = data;
      await storeJWT(data);
      dispatch(setCurrentUser(user));
      dispatch(resetUserForm());
    } catch (err) {
      console.log('now wat in tarnation', err);
    }
  };
}
