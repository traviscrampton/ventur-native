import { setLoadingTrue, setLoadingFalse } from './common';
import { get, put } from '../agent';

const googlePolyline = require('google-polyline');

export const POPULATE_MAP = 'POPULATE_MAP';
export function populateMap(payload) {
  return {
    type: POPULATE_MAP,
    payload
  };
}

export const UPDATE_STARTING_POLYLINES = 'UPDATE_STARTING_POLYLINES';
export function updateStartingPolylines() {
  return {
    type: UPDATE_STARTING_POLYLINES
  };
}

export const DRAW_POLYLINE = 'DRAW_POLYLINE';
export function drawPolyline(payload) {
  return {
    type: DRAW_POLYLINE,
    payload
  };
}

export const SET_CAN_DRAW = 'SET_CAN_DRAW';
export function setCanDraw(payload) {
  return {
    type: SET_CAN_DRAW,
    payload
  };
}

export const CANCEL_ALL_MODES = 'CANCEL_ALL_MODES';
export function cancelAllModes() {
  return {
    type: CANCEL_ALL_MODES
  };
}

export const UPDATE_INITIAL_REGION = 'UPDATE_INITIAL_REGION';
export function updateInitialRegion() {
  return {
    type: UPDATE_INITIAL_REGION
  };
}

export const ERASE_TOTAL_ROUTE = 'ERASE_TOTAL_ROUTE';
export function eraseRoute() {
  return {
    type: ERASE_TOTAL_ROUTE
  };
}

export const SAVING_MAP_BEGIN = 'SAVING_MAP_BEGIN';
export function savingMapBegin() {
  return {
    type: SAVING_MAP_BEGIN
  };
}

export const SAVING_MAP_END = 'SAVING_MAP_END';
export function savingMapEnd() {
  return {
    type: SAVING_MAP_END
  };
}

export const DEFAULT_ROUTE_EDTIOR = 'DEFAULT_ROUTE_EDTIOR';
export function defaultRouteEditor() {
  return {
    type: DEFAULT_ROUTE_EDTIOR
  };
}

export function persistRoute() {
  return function(dispatch, getState) {
    dispatch(savingMapBegin());
    let { polylines } = getState().routeEditor;
    const { id, shownIndex } = getState().routeEditor;
    let { includedActivities } = getState().stravaActivityImport;

    if (shownIndex !== polylines.length - 1) {
      polylines.length = shownIndex + 1;
      polylines = [...polylines, []];
    }

    polylines = polylines.map(polylineArr => {
      return googlePolyline.encode(polylineArr);
    });

    polylines = JSON.stringify(polylines);
    includedActivities = JSON.stringify(includedActivities);

    const params = { polylines, included_activities: includedActivities };
    put(`/cycle_routes/${id}`, params).then(res => {
      polylines = JSON.parse(res.cycleRoute.polylines);
      polylines = polylines.map(polyline => {
        return googlePolyline.decode(polyline);
      });

      dispatch(drawPolyline({ polylines, shownIndex: polylines.length - 1 }));
      dispatch(updateStartingPolylines());
      dispatch(savingMapEnd());
    });
  };
}

export function persistCoordinates() {
  return function(dispatch, getState) {
    dispatch(savingMapBegin());
    const { id, changedRegion } = getState().routeEditor;
    const {
      latitude,
      longitude,
      longitudeDelta,
      latitudeDelta
    } = changedRegion;
    const params = {
      latitude,
      longitude,
      longitudeDelta,
      latitudeDelta
    };

    put(`/cycle_routes/${id}`, params).then(() => {
      dispatch(updateInitialRegion());
      dispatch(savingMapEnd());
    });
  };
}

export const UPDATE_REGION_COORDINATES = 'UPDATE_REGION_COORDINATES';
export function updateRegionCoordinates(coordinates) {
  return {
    type: UPDATE_REGION_COORDINATES,
    payload: coordinates
  };
}

export const SET_DRAW_MODE = 'SET_DRAW_MODE';
export function setDrawMode(payload) {
  return {
    type: SET_DRAW_MODE,
    payload
  };
}

export const SET_POSITION_MODE = 'SET_POSITION_MODE';
export function setPositionMode(payload) {
  return {
    type: SET_POSITION_MODE,
    payload
  };
}

export function togglePositionMode() {
  return function(dispatch, getState) {
    const { positionMode } = getState().routeEditor;
    dispatch(setPositionMode(!positionMode));
  };
}

export function toggleDrawMode() {
  return function(dispatch, getState) {
    const { drawMode } = getState().routeEditor;
    dispatch(setDrawMode(!drawMode));
  };
}

export const SET_IS_DRAWING = 'SET_IS_DRAWING';
export function setIsDrawing(payload) {
  return {
    type: SET_IS_DRAWING,
    payload
  };
}

export const SET_NEXT_DRAW = 'SET_NEXT_DRAW';
export function setNextDraw(payload) {
  return {
    type: SET_NEXT_DRAW,
    payload
  };
}

export const SET_SHOWN_INDEX = 'SET_SHOWN_INDEX';
export function setShownIndex(payload) {
  return {
    type: SET_SHOWN_INDEX,
    payload
  };
}

export function setupNextDraw() {
  return function(dispatch, getState) {
    const { polylines } = getState().routeEditor;
    const newPolylines = [...polylines, []];

    const payload = {
      isDrawing: false,
      polylines: newPolylines,
      shownIndex: polylines.length
    };
    dispatch(setNextDraw(payload));
  };
}

export const addStravaImportRoute = stravaImport => {
  return async (dispatch, getState) => {
    let { polylines } = getState().routeEditor;
    polylines = [...polylines, stravaImport, []];
    dispatch(drawPolyline({ polylines, shownIndex: polylines.length - 1 }));
  };
};

export function drawLine(coordinate) {
  return function(dispatch, getState) {
    const { shownIndex } = getState().routeEditor;
    let polylines = [...getState().routeEditor.polylines];

    if (shownIndex !== polylines.length - 1) {
      polylines.length = shownIndex + 1;
      polylines = [...polylines, []];
    }

    const lastPolylineIndex = polylines.length - 1;
    const lastPolylineArray = polylines[lastPolylineIndex];
    const updatedPolyLineCoordinates = Object.assign([], lastPolylineArray, {
      [lastPolylineArray.length]: coordinate
    });
    const newPolylines = Object.assign([], polylines, {
      [lastPolylineIndex]: updatedPolyLineCoordinates
    });
    dispatch(
      drawPolyline({ polylines: newPolylines, shownIndex: lastPolylineIndex })
    );
  };
}

export function loadRouteEditor(cycleRouteId) {
  return function(dispatch) {
    dispatch(setLoadingTrue());
    get(`/cycle_routes/${cycleRouteId}/editor_show`).then(res => {
      let {
        cycleRoute: { polylines, previousPolylines, includedActivities },
        cycleRoute
      } = res;

      includedActivities =
        includedActivities.length === 0 ? [] : JSON.parse(includedActivities);

      polylines =
        polylines.length === 0
          ? [[], []]
          : JSON.parse(polylines).map(polyline => {
              return googlePolyline.decode(polyline);
            });
      previousPolylines = [[]];
      cycleRoute = {
        ...cycleRoute,
        polylines,
        previousPolylines,
        includedActivities
      };
      dispatch(populateMap(cycleRoute));
      dispatch(setLoadingFalse());
    });
  };
}
