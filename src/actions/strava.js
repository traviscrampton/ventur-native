import { encodeQueryString, post } from '../agent';
import { storeStravaCredentials } from '../auth';

export const getUrlParams = url => {
  const hashes = url.slice(url.indexOf('?') + 1).split('&');
  const params = {};
  for (let hash of hashes) {
    const [key, val] = hash.split('=');
    params[key] = decodeURIComponent(val);
  }

  return params;
};

const getCodeFromUrl = result => {
  const { url } = result;
  const params = getUrlParams(url);
  return params.code;
};

export const ADD_STRAVA_TO_CURRENT_USER = 'ADD_STRAVA_TO_CURRENT_USER';
export function addStravaToCurrentUser(payload) {
  return {
    type: ADD_STRAVA_TO_CURRENT_USER,
    payload
  };
}

export const persistAccessToken = response => {
  return async dispatch => {
    const params = {
      stravaAccessToken: response.access_token,
      stravaRefreshToken: response.refresh_token,
      stravaExpiresAt: response.expires_at
    };

    await post('/strava_auths', params);
    await storeStravaCredentials(params);
    dispatch(addStravaToCurrentUser(params));
  };
};

export const validateUser = code => {
  return async (dispatch, getState) => {
    const { stravaClientId, stravaClientSecret } = getState().common;
    let url = 'https://www.strava.com/oauth/token';

    const params = {
      client_id: stravaClientId,
      client_secret: stravaClientSecret,
      grant_type: 'authorization_code',
      code
    };

    url += encodeQueryString(params);

    return fetch(url, {
      method: 'POST'
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        return data;
      })
      .catch(err => {
        console.log('error!', err);
        if (err.status === 401) {
          console.log('error 401');
        }
      });
  };
};

export const getActivities = () => {
  const url = 'https://www.strava.com/api/v3/athlete/activities?per_page=60';
  const accessToken = 'caeaf06fd8bfffd3d6d3a245ce9519ca0de889b7';

  fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log('DADA', data);
      return data;
    })
    .catch(err => {
      console.log('error!', err);
      if (err.status === 401) {
        console.log('error 401');
      }
    });
};

export const authenticateStravaUser = result => {
  return async dispatch => {
    const code = getCodeFromUrl(result);
    dispatch(validateUser(code)).then(response => {
      dispatch(persistAccessToken(response));
    });
  };
};
