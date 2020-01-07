import { setCurrentUser } from './common';
import { addStravaToCurrentUser } from './strava';
import { storeJWT, storeStravaCredentials } from '../auth';
import { post } from '../agent';

export const UPDATE_LOGIN_FORM = 'UPDATE_LOGIN_FORM';
export function updateLoginForm(payload) {
  return {
    type: UPDATE_LOGIN_FORM,
    payload
  };
}

export const RESET_LOGIN_FORM = 'RESET_LOGIN_FORM';
export function resetLoginForm(payload) {
  return {
    type: RESET_LOGIN_FORM,
    payload
  };
}

export async function storeUserInformationOnDevice(login, stravaObject) {
  await storeJWT(login);
  await storeStravaCredentials(stravaObject);
}

export function submitForm() {
  return async function(dispatch, getState) {
    const { email, password } = getState().login;
    try {
      const login = await post('/users/login', { email, password });
      const {
        user,
        stravaAccessToken,
        stravaRefreshToken,
        stravaExpiresAt
      } = login;
      const stravaObject = {
        stravaAccessToken,
        stravaRefreshToken,
        stravaExpiresAt
      };
      await storeUserInformationOnDevice(login, stravaObject);
      dispatch(setCurrentUser(user));
      dispatch(addStravaToCurrentUser(stravaObject));
      dispatch(resetLoginForm());
    } catch (err) {
      console.log('what in tarnation', err);
    }
  };
}

export const TOGGLE_LOGIN_MODAL = 'TOGGLE_LOGIN_MODAL';
export function toggleLoginModal(payload) {
  return {
    type: TOGGLE_LOGIN_MODAL,
    payload
  };
}
