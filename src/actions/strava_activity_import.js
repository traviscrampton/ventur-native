import { addStravaImportRoute } from './route_editor';
import { encodeQueryString } from '../agent';
import { persistAccessToken } from './strava';

const googlePolyline = require('google-polyline');

export const SET_STRAVA_LOADING_TRUE = 'SET_STRAVA_LOADING_TRUE';
export const setStravaLoadingTrue = () => {
  return {
    type: SET_STRAVA_LOADING_TRUE
  };
};

export const ADD_TO_SELECTED_IDS = 'ADD_TO_SELECTED_IDS';
export const addToSelectedIds = payload => {
  return {
    type: ADD_TO_SELECTED_IDS,
    payload
  };
};

export const REMOVE_FROM_SELECTED_IDS = 'REMOVE_FROM_SELECTED_IDS';
export const removeFromSelectedIds = payload => {
  return {
    type: REMOVE_FROM_SELECTED_IDS,
    payload
  };
};

export const SET_STRAVA_LOADING_FALSE = 'SET_STRAVA_LOADING_FALSE';
export const setStravaLoadingFalse = () => {
  return {
    type: SET_STRAVA_LOADING_FALSE
  };
};

export const ADD_ACTIVITY_TO_INCLUDED_ACTIVITIES =
  'ADD_ACTIVITY_TO_INCLUDED_ACTIVITIES';
export const addActivityToIncludedActivities = payload => {
  return {
    type: ADD_ACTIVITY_TO_INCLUDED_ACTIVITIES,
    payload
  };
};

export const INITIAL_ACTIVITY_LOAD = 'INITIAL_ACTIVITY_LOAD';
export const initialActivityLoad = payload => {
  return {
    type: INITIAL_ACTIVITY_LOAD,
    payload
  };
};

export const ADD_TO_ACTIVITY_TO_IMPORT = 'ADD_TO_ACTIVITY_TO_IMPORT';
export const addToActivitesToImport = payload => {
  return {
    type: ADD_TO_ACTIVITY_TO_IMPORT,
    payload
  };
};

const updateDistanceToChapter = (distance, chapterDistanceObj) => {
  let stringDistance = Math.round(distance / 1000);

  if (chapterDistanceObj.type === 'mile') {
    stringDistance = Math.round(stringDistance * 0.6);
  }

  return `${stringDistance} ${chapterDistanceObj.readableDistanceType}`;
};

const MONTHS = [
  'January',
  'Feburary',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export const generateReadableDate = startDate => {
  const date = new Date(startDate);
  const month = MONTHS[date.getMonth()];
  const day = ` ${date.getDate()}, `;
  const year = date.getFullYear();

  return month + day + year;
};

export const requestForStravaActivity = async (
  activityId,
  stravaAccessToken
) => {
  const url = `https://www.strava.com/api/v3/activities/${activityId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${stravaAccessToken}`
    }
  });

  const data = await response.json();
  const {
    id,
    map: { polyline }
  } = data;
  return { id, polyline };
};

const shapeRoutesForRender = (activityArray, chapterDistance) => {
  // figure out if distance changes depending on what it is
  let distance;
  let date;

  return activityArray.map(activity => {
    distance = updateDistanceToChapter(activity.distance, chapterDistance);
    date = generateReadableDate(activity.start_date);

    return {
      id: activity.id,
      name: activity.name,
      distance,
      date
    };
  });
};

export const loadInitialStravaData = () => {
  return async (dispatch, getState) => {
    const url = 'https://www.strava.com/api/v3/athlete/activities?per_page=50';
    const { stravaAccessToken } = getState().common;
    const { distance } = getState().chapter.chapter;

    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${stravaAccessToken}`
      }
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        const shapedRoutes = shapeRoutesForRender(data, distance);
        dispatch(initialActivityLoad(shapedRoutes));
        dispatch(setStravaLoadingFalse());
      })
      .catch(err => {
        console.log('error!', err);
        if (err.status === 401) {
          console.log('error 401');
          // return logout()
        }
      });
  };
};

export const refreshAccessToken = () => {
  return async (dispatch, getState) => {
    const {
      stravaRefreshToken,
      stravaClientId,
      stravaClientSecret
    } = getState().common;
    let url = 'https://www.strava.com/oauth/token';
    const params = {
      client_id: stravaClientId,
      client_secret: stravaClientSecret,
      grant_type: 'refresh_token',
      refresh_token: stravaRefreshToken
    };
    url += encodeQueryString(params);

    fetch(url, {
      method: 'POST'
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        dispatch(persistAccessToken(data));
        dispatch(loadInitialStravaData());
      })
      .catch(err => {
        console.log('error!', err);
        if (err.status === 401) {
          console.log('error 401');
          // return logout()
        }
      });
  };
};

export const makeStravaActivityRequests = () => {
  return async (dispatch, getState) => {
    const { selectedIds, includedActivities } = getState().stravaActivityImport;
    const { stravaAccessToken } = getState().common.currentUser;
    const includedActivitiesIds = includedActivities.map(activity => {
      return activity.id;
    });

    for (let id of selectedIds) {
      if (includedActivitiesIds.includes(id)) {
        continue;
      }

      const activity = await requestForStravaActivity(id, stravaAccessToken);
      dispatch(addToActivitesToImport(activity));
    }

    console.log('all finished here in activity Requests');
  };
};

export const importStravaActivites = payload => {
  return async (dispatch, getState) => {
    dispatch(setStravaLoadingTrue());
    await dispatch(makeStravaActivityRequests());

    const { activitiesToImport } = getState().stravaActivityImport;

    for (let activity of activitiesToImport) {
      dispatch(addStravaImportRoute(googlePolyline.decode(activity.polyline)));
      dispatch(
        addActivityToIncludedActivities({
          id: activity.id,
          polyline: activity.polyline
        })
      );
    }

    payload.goBack();
    dispatch(setStravaLoadingFalse());
  };
};

export const checkForExpiredToken = () => {
  return async (dispatch, getState) => {
    if (getState().common.stravaExpiresAt < new Date().getTime() / 1000) {
      dispatch(refreshAccessToken());
    } else {
      dispatch(loadInitialStravaData());
    }
  };
};
