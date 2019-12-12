import { get } from "../agent";
import { setLoadingTrue, setLoadingFalse } from "./common";
const googlePolyline = require("google-polyline");

export function loadRouteViewer(id) {
  return function(dispatch, getState) {
    dispatch(setLoadingTrue());
    get(`/cycle_routes/${id}`).then(res => {
      let {
        cycleRoute,
        cycleRoute: { polylines, initialRegion }
      } = res;
      polylines = JSON.parse(polylines);
      polylines =
        polylines.length === 0
          ? [[], []]
          : polylines.map(polyline => {
              return googlePolyline.decode(polyline);
            });
      cycleRoute = Object.assign(
        {},
        {
          id,
          polylines,
          initialRegion
        }
      );
      dispatch(populateRouteViewer(cycleRoute));
      dispatch(setLoadingFalse());
    });
  };
}

export const POPULATE_ROUTE_VIEWER = "POPULATE_ROUTE_VIEWER";
function populateRouteViewer(payload) {
  return {
    type: POPULATE_ROUTE_VIEWER,
    payload: payload
  };
}

const DEFAULT_ROUTE_VIEWER = "DEFAULT_ROUTE_VIEWER";
export function defaultRouteViewer() {
  return {
    type: DEFAULT_ROUTE_VIEWER
  };
}
