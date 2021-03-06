import { get, setToken, API_ROOT, handleError } from '../agent';

export const TOGGLE_PROFILE_PHOTO_LOADING = 'TOGGLE_PROFILE_PHOTO_LOADING';
export function toggleProfilePhotoLoading(payload) {
  return {
    type: TOGGLE_PROFILE_PHOTO_LOADING,
    payload
  };
}

export const TOGGLE_IS_REFRESHING = 'TOGGLE_IS_REFRESHING';
export function toggleIsRefreshing(payload) {
  return {
    type: TOGGLE_IS_REFRESHING,
    payload
  };
}

export const POPULATE_OFFLINE_CHAPTERS = 'POPULATE_OFFLINE_CHAPTERS';
export function populateOfflineChapters(payload) {
  return {
    type: POPULATE_OFFLINE_CHAPTERS,
    payload
  };
}

export const POPULATE_USER_JOURNALS = 'POPULATE_USER_JOURNALS';
export function populateUserJournals(payload) {
  return {
    type: POPULATE_USER_JOURNALS,
    payload
  };
}

export const POPULATE_USER_GEAR = 'POPULATE_USER_GEAR';
export function populateUserGear(payload) {
  return {
    type: POPULATE_USER_GEAR,
    payload
  };
}

export const POPULATE_USER_PAGE = 'POPULATE_USER_PAGE';
export function populateUserPage(payload) {
  return {
    type: POPULATE_USER_PAGE,
    payload
  };
}

export function uploadProfilePhoto(img) {
  return async function(dispatch, getState) {
    dispatch(toggleProfilePhotoLoading(true));
    const formData = new FormData();
    const userId = getState().user.user.id;
    const imgPost = {
      uri: img.uri,
      name: img.filename,
      type: 'multipart/form-data'
    };
    formData.append('avatar', imgPost);
    const token = await setToken();
    fetch(`${API_ROOT}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: formData
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(data => {
        dispatch(toggleProfilePhotoLoading(false));
        dispatch(populateUserPage(data.user));
        return data;
      })
      .catch(error => {
        handleError(error);

        throw new Error();
      });
  };
}

export function getUserGear(id) {
  return async function(dispatch) {
    try {
      const data = await get(`/users/${id}/gear_item_reviews`);
      dispatch(populateUserGear(data.gearItemReviews));
    } catch (err) {
      console.log('what in tarnation', err);
    }
  };
}

export const SET_DEFAULT_APP_STATE = 'SET_DEFAULT_APP_STATE';
export function setDefaultAppState() {
  return {
    type: SET_DEFAULT_APP_STATE
  };
}

export const TOGGLE_IS_LOADING = 'TOGGLE_IS_LOADING';
export function toggleIsLoading(payload) {
  return {
    type: TOGGLE_IS_LOADING,
    payload
  };
}

export function getProfilePageData() {
  return async function(dispatch, getState) {
    dispatch(toggleIsLoading(true));
    const currentUserId = getState().common.currentUser.id;
    try {
      const res = await get(`/users/${currentUserId}`);
      dispatch(populateUserPage(res.user));
      dispatch(getUserGear(currentUserId));
    } catch (err) {
      console.log('wat in tarnation ', err);
    }

    dispatch(toggleIsLoading(false));
  };
}
