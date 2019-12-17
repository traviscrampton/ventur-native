import { get } from '../agent';
import { setLoadingTrue, setLoadingFalse } from './common';

const googlePolyline = require('google-polyline');

export const POPULATE_ROUTE_VIEWER = 'POPULATE_ROUTE_VIEWER';
function populateRouteViewer(payload) {
  return {
    type: POPULATE_ROUTE_VIEWER,
    payload
  };
}

export const DEFAULT_ROUTE_VIEWER = 'DEFAULT_ROUTE_VIEWER';
export function defaultRouteViewer() {
  return {
    type: DEFAULT_ROUTE_VIEWER
  };
}

export function loadRouteViewer(id) {
  return function(dispatch) {
    dispatch(setLoadingTrue());
    get(`/cycle_routes/${id}`).then(res => {
      let {
        cycleRoute,
        cycleRoute: { polylines }
      } = res;
      const { initialRegion } = cycleRoute;
      polylines = JSON.parse(polylines);
      polylines =
        polylines.length === 0
          ? [[], []]
          : polylines.map(polyline => {
              return googlePolyline.decode(polyline);
            });
      cycleRoute = {
        id,
        polylines,
        initialRegion
      };
      dispatch(populateRouteViewer(cycleRoute));
      dispatch(setLoadingFalse());
    });
  };
}
