import { setLoadingTrue, setLoadingFalse } from "actions/common"
import { get, put } from "agent"
import base64 from "react-native-base64"

export const POPULATE_MAP = "POPULATE_MAP"
export function populateMap(payload) {
  return {
    type: POPULATE_MAP,
    payload: payload
  }
}

export function persistRoute() {
  return function(dispatch, getState) {
    let { id, polylines } = getState().routeEditor
    polylines = base64.encode(JSON.stringify(polylines))
    let params = Object.assign({}, { polylines })
    put(`/cycle_routes/${id}`, params).then(res => {
      console.log("SUCCESS!")
    })
  }
}

export const SET_DRAW_MODE = "SET_DRAW_MODE"
export function setDrawMode(payload) {
  return {
    type: SET_DRAW_MODE,
    payload: payload
  }
}

export const SET_POSITION_MODE = "SET_POSITION_MODE"
export function setPositionMode(payload) {
  return {
    type: SET_POSITION_MODE,
    payload: payload
  }
}

export function togglePositionMode() {
  return function(dispatch, getState) {
    const { positionMode } = getState().routeEditor
    dispatch(setPositionMode(!positionMode))
  }
}

export function toggleDrawMode() {
  return function(dispatch, getState) {
    const { drawMode } = getState().routeEditor
    dispatch(setDrawMode(!drawMode))
  }
}

export const SET_IS_DRAWING = "SET_IS_DRAWING"
export function setIsDrawing(payload) {
  return {
    type: SET_IS_DRAWING,
    payload: payload
  }
}

export const DRAW_POLYLINE = "DRAW_POLYLINE"
export function drawPolyline(payload) {
  return {
    type: DRAW_POLYLINE,
    payload: payload
  }
}

export const SET_NEXT_DRAW = "SET_NEXT_DRAW"
export function setNextDraw(payload) {
  return {
    type: SET_NEXT_DRAW,
    payload: payload
  }
}

export const SET_SHOWN_INDEX = "SET_SHOWN_INDEX"
export function setShownIndex(payload) {
  return {
    type: SET_SHOWN_INDEX,
    payload: payload
  }
}

export function setupNextDraw() {
  return function(dispatch, getState) {
    const { polylines } = getState().routeEditor
    const newPolylines = [...polylines, []]

    const payload = Object.assign({}, { isDrawing: false, polylines: newPolylines, shownIndex: polylines.length })
    dispatch(setNextDraw(payload))
  }
}

export function drawLine(coordinate) {
  return function(dispatch, getState) {
    let { shownIndex } = getState().routeEditor
    let polylines = [...getState().routeEditor.polylines]

    if (shownIndex !== polylines.length - 1) {
      polylines.length = shownIndex + 1
      polylines = [...polylines, []]
    }

    const lastPolylineIndex = polylines.length - 1
    const lastPolylineArray = polylines[lastPolylineIndex]
    const updatedPolyLineCoordinates = Object.assign([], lastPolylineArray, {
      [lastPolylineArray.length]: coordinate
    })
    const newPolylines = Object.assign([], polylines, { [lastPolylineIndex]: updatedPolyLineCoordinates })
    dispatch(drawPolyline({ polylines: newPolylines, shownIndex: lastPolylineIndex }))
  }
}

export function loadChapterMap(cycleRouteId) {
  return function(dispatch, getState) {
    dispatch(setLoadingTrue())
    get(`/cycle_routes/${cycleRouteId}`).then(res => {
      let { cycleRoute } = res
      let polylines = cycleRoute.polylines.length === 0 ? [[], []] : JSON.parse(base64.decode(cycleRoute.polylines))
      console.log(polylines, polylines.length)
      cycleRoute = Object.assign({}, cycleRoute, { polylines })
      dispatch(populateMap(cycleRoute))
      dispatch(setLoadingFalse())
    })
  }
}
