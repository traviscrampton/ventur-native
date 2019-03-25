import {
  SET_DRAW_MODE,
  SET_SHOWN_INDEX,
  SET_POSITION_MODE,
  SET_IS_DRAWING,
  DRAW_POLYLINE,
  SET_NEXT_DRAW,
  POPULATE_MAP
} from "actions/route_editor"

const defaultRouteData = {
  id: null,
  polylineEditor: true,
  drawMode: false,
  shownIndex: 1,
  positionMode: false,
  polylines: [[]],

  initialRegion: {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03
  },
  initialPolylineLength: 1,
  isDrawing: false
}

export default (state = defaultRouteData, action) => {
  switch (action.type) {
    case POPULATE_MAP:
      return {
        ...state,
        initialRegion: action.payload.initialRegion,
        polylines: action.payload.polylines,
        id: action.payload.id,
        shownIndex: action.payload.polylines.length - 1,
        initialPolylineLength: action.payload.polylines.length - 2
      }

    case SET_SHOWN_INDEX:
      return {
        ...state,
        shownIndex: action.payload
      }

    case SET_NEXT_DRAW:
      return {
        ...state,
        isDrawing: action.payload.isDrawing,
        polylines: action.payload.polylines,
        shownIndex: action.payload.shownIndex
      }

    case DRAW_POLYLINE:
      return {
        ...state,
        polylines: action.payload.polylines,
        shownIndex: action.payload.shownIndex
      }

    case SET_IS_DRAWING:
      return {
        ...state,
        isDrawing: action.payload
      }

    case SET_DRAW_MODE:
      return {
        ...state,
        drawMode: action.payload
      }

    case SET_POSITION_MODE:
      return {
        ...state,
        positionMode: action.payload
      }

    default:
      return state
  }
}
