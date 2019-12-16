import { get } from '../agent';
import { setLoadingTrue, setLoadingFalse } from './common';
const googlePolyline = require('google-polyline');

export const POPULATE_ID = 'POPULATE_ID';
export function populateId(payload) {
  return {
    type: POPULATE_ID,
    payload
  };
}

export const POPULATE_JOURNAL_ROUTE = 'POPULATE_JOURNAL_ROUTE';
function populateJournalRoute(payload) {
  return {
    type: POPULATE_JOURNAL_ROUTE,
    payload
  };
}

const DEFAULT_JOURNAL_ROUTE = 'DEFAULT_JOURNAL_ROUTE';
export function defaultJournalRoute() {
  return {
    type: DEFAULT_JOURNAL_ROUTE
  };
}

export function loadJournalMap(journalId) {
  return function(dispatch, getState) {
    dispatch(setLoadingTrue());
    get('/cycle_routes', { journalId }).then(res => {
      let { polylines } = res;
      const { id, initialRegion } = res;

      polylines = polylines.map(polyString => {
        return polyString.length === 0
          ? []
          : JSON.parse(polyString).map(polyline => {
              return googlePolyline.decode(polyline);
            });
      });

      if (
        getState().common.currentUser.id === getState().journal.journal.user.id
      ) {
        dispatch(populateId(id));
      }

      const payload = { id, polylines, initialRegion };
      dispatch(populateJournalRoute(payload));
      dispatch(setLoadingFalse());
    });
  };
}
