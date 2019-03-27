import { setLoadingTrue, setLoadingFalse } from "actions/common"
import { get, put, destroy } from "agent"
import base64 from "react-native-base64"

export const POPULATE_MAP = "POPULATE_MAP"
export function populateMap(payload) {
  return {
    type: POPULATE_MAP,
    payload: payload
  }
}

export const UPDATE_INITIAL_REGION = "UPDATE_INITIAL_REGION"
export function updateInitialRegion() {
  return {
    type: UPDATE_INITIAL_REGION
  }
}

export const ERASE_TOTAL_ROUTE = "ERASE_TOTAL_ROUTE"
export function eraseRoute() {
  return {
    type: ERASE_TOTAL_ROUTE
  }
}

export const SAVING_MAP_BEGIN = "SAVING_MAP_BEGIN"
export function savingMapBegin() {
  return {
    type: SAVING_MAP_BEGIN
  }
}

export const SAVING_MAP_END = "SAVING_MAP_END"
export function savingMapEnd() {
  return {
    type: SAVING_MAP_END
  }
}

export const DEFAULT_ROUTE_EDTIOR = "DEFAULT_ROUTE_EDTIOR"
export function defaultRouteEditor() {
  return {
    type: DEFAULT_ROUTE_EDTIOR
  }
}

export function persistRoute() {
  return function(dispatch, getState) {
    dispatch(savingMapBegin())
    let { id, polylines, shownIndex } = getState().routeEditor

    if (shownIndex !== polylines.length - 1) {
      polylines.length = shownIndex + 1
      polylines = [...polylines, []]
    }

    polylines = base64.encode(JSON.stringify(polylines))
    let params = Object.assign({}, { polylines })
    put(`/cycle_routes/${id}`, params).then(res => {
      const newPolylines = JSON.parse(base64.decode(res.cycleRoute.polylines))

      dispatch(drawPolyline({ polylines: newPolylines, shownIndex: newPolylines.length - 1 }))
      dispatch(updateStartingPolylines())
      dispatch(savingMapEnd())
    })
  }
}

export function persistCoordinates() {
  return function(dispatch, getState) {
    dispatch(savingMapBegin())
    let { id, changedRegion } = getState().routeEditor
    let { latitude, longitude, longitudeDelta, latitudeDelta } = changedRegion
    let params = Object.assign(
      {},
      { latitude: latitude, longitude: longitude, longitude_delta: longitudeDelta, latitude_delta: latitudeDelta }
    )
    put(`/cycle_routes/${id}`, params).then(res => {
      dispatch(updateInitialRegion())
      dispatch(savingMapEnd())
    })
  }
}

export const UPDATE_REGION_COORDINATES = "UPDATE_REGION_COORDINATES"
export function updateRegionCoordinates(coordinates) {
  return {
    type: UPDATE_REGION_COORDINATES,
    payload: coordinates
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

export const UPDATE_STARTING_POLYLINES = "UPDATE_STARTING_POLYLINES"
export function updateStartingPolylines() {
  return {
    type: UPDATE_STARTING_POLYLINES
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

export function loadRouteEditor(cycleRouteId) {
  return function(dispatch, getState) {
    dispatch(setLoadingTrue())
    get(`/cycle_routes/${cycleRouteId}/editor_show`).then(res => {
      let { cycleRoute } = res
      let polylines = cycleRoute.polylines.length === 0 ? [[], []] : JSON.parse(base64.decode(cycleRoute.polylines))
      let previousPolylines = cycleRoute.previousPolylines.length === 0 ? [[]] : JSON.parse(base64.decode(cycleRoute.previousPolylines))
      cycleRoute = Object.assign({}, cycleRoute, { polylines, previousPolylines })
      dispatch(populateMap(cycleRoute))
      dispatch(setLoadingFalse())
    })
  }
}