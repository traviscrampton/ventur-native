import { get } from "../agent"
import { setLoadingTrue, setLoadingFalse } from "./common"
const googlePolyline = require("google-polyline")
import { populateMap } from "./route_editor"

export function loadJournalMap(id) {
  return function(dispatch, getState) {
    dispatch(setLoadingTrue())
    get(`/cycle_routes`, { journalId: id }).then(res => {
      let { id, polylines, initialRegion } = res

      polylines = polylines.map((polyString, index) => {
        return polyString.length === 0
          ? []
          : JSON.parse(polyString).map(polyline => {
              return googlePolyline.decode(polyline)
            })
      })

      if (getState().common.currentUser.id == getState().journal.journal.user.id) {
        dispatch(populateId(id))
      }

      let payload = Object.assign({}, { id, polylines, initialRegion })
      dispatch(populateJournalRoute(payload))
      dispatch(setLoadingFalse())
    })
  }
}

export const POPULATE_ID = "POPULATE_ID"
export function populateId(payload) {
  return {
    type: POPULATE_ID,
    payload: payload
  }
}

export const POPULATE_JOURNAL_ROUTE = "POPULATE_JOURNAL_ROUTE"
function populateJournalRoute(payload) {
  return {
    type: POPULATE_JOURNAL_ROUTE,
    payload: payload
  }
}

const DEFAULT_JOURNAL_ROUTE = "DEFAULT_JOURNAL_ROUTE"
export function defaultJournalRoute() {
  return {
    type: DEFAULT_JOURNAL_ROUTE
  }
}
