import {
  SET_DRAW_MODE,
  SET_CAN_DRAW,
  SET_SHOWN_INDEX,
  SET_POSITION_MODE,
  SET_IS_DRAWING,
  DRAW_POLYLINE,
  SET_NEXT_DRAW,
  POPULATE_MAP,
  UPDATE_REGION_COORDINATES,
  SAVING_MAP_BEGIN,
  SAVING_MAP_END,
  ERASE_TOTAL_ROUTE,
  UPDATE_INITIAL_REGION,
  UPDATE_STARTING_POLYLINES,
  CANCEL_ALL_MODES,
  DEFAULT_ROUTE_EDTIOR
} from '../actions/route_editor';
import { POPULATE_ID } from '../actions/journal_route';

const defaultRouteData = {
  id: null,
  polylineEditor: true,
  drawMode: false,
  shownIndex: 1,
  positionMode: false,
  startingPolylines: [[], []],
  polylines: [[], []],
  previousPolylines: [[], []],
  initialRegion: {},
  changedRegion: {},
  initialPolylineLength: 1,
  isDrawing: false,
  isSaving: false,
  canDraw: false
};

export default (state = defaultRouteData, action) => {
  switch (action.type) {
    case POPULATE_MAP:
      return {
        ...state,
        initialRegion: action.payload.initialRegion,
        changedRegion: action.payload.initialRegion,
        polylines: action.payload.polylines,
        startingPolylines: action.payload.polylines,
        previousPolylines: action.payload.previousPolylines,
        id: action.payload.id,
        shownIndex: action.payload.polylines.length - 1,
        initialPolylineLength: action.payload.polylines.length - 2
      };

    case ERASE_TOTAL_ROUTE:
      return {
        ...state,
        polylines: defaultRouteData.polylines,
        initialPolylineLength: defaultRouteData.initialPolylineLength,
        shownIndex: defaultRouteData.shownIndex
      };
    case SET_CAN_DRAW:
      return {
        ...state,
        canDraw: action.payload
      };

    case SAVING_MAP_BEGIN:
      return {
        ...state,
        isSaving: true
      };

    case SAVING_MAP_END:
      return {
        ...state,
        isSaving: false
      };

    case CANCEL_ALL_MODES:
      return {
        ...state,
        drawMode: false,
        canDraw: false,
        positionMode: false
      };

    case UPDATE_STARTING_POLYLINES:
      return {
        ...state,
        startingPolylines: [...state.polylines]
      };

    case UPDATE_REGION_COORDINATES:
      return {
        ...state,
        changedRegion: action.payload
      };

    case SET_SHOWN_INDEX:
      return {
        ...state,
        shownIndex: action.payload
      };

    case SET_NEXT_DRAW:
      return {
        ...state,
        isDrawing: action.payload.isDrawing,
        polylines: action.payload.polylines,
        shownIndex: action.payload.shownIndex
      };

    case DRAW_POLYLINE:
      return {
        ...state,
        polylines: action.payload.polylines,
        shownIndex: action.payload.shownIndex
      };

    case SET_IS_DRAWING:
      return {
        ...state,
        isDrawing: action.payload
      };

    case SET_DRAW_MODE:
      return {
        ...state,
        drawMode: action.payload,
        positionMode: false
      };

    case UPDATE_INITIAL_REGION:
      return {
        ...state,
        initialRegion: { ...state.changedRegion }
      };
    case POPULATE_ID:
      return {
        ...state,
        id: action.payload
      };

    case SET_POSITION_MODE:
      return {
        ...state,
        positionMode: action.payload,
        drawMode: false,
        canDraw: false
      };

    case DEFAULT_ROUTE_EDTIOR:
      return defaultRouteData;

    default:
      return state;
  }
};
