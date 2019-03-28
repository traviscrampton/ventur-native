import { get } from "agent"
import { setLoadingTrue, setLoadingFalse } from "actions/common"
import base64 from "react-native-base64"

export function loadRouteViewer(id) {
  return function(dispatch, getState) {
    dispatch(setLoadingTrue())
    get(`/cycle_routes/${id}`).then(res => {
      let { cycleRoute } = res
      let { polylines, initialRegion } = cycleRoute
      polylines = polylines.length === 0 ? [[], []] : JSON.parse(base64.decode(polylines))
      cycleRoute = Object.assign(
        {},
        {
          id,
          polylines,
          initialRegion
        }
      )
      dispatch(populateRouteViewer(cycleRoute))
      dispatch(setLoadingFalse())
    })
  }
}

export const POPULATE_ROUTE_VIEWER = "POPULATE_ROUTE_VIEWER"
function populateRouteViewer(payload) {
  return {
    type: POPULATE_ROUTE_VIEWER,
    payload: payload
  }
}

const DEFAULT_ROUTE_VIEWER = "DEFAULT_ROUTE_VIEWER"
export function defaultRouteViewer() {
  return {
    type: DEFAULT_ROUTE_VIEWER
  }
}
