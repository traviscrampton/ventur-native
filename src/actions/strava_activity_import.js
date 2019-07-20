import { addStravaImportRoute } from "./route_editor"
import { encodeQueryString } from "../agent"
import { persistAccessToken } from "./strava"

const googlePolyline = require("google-polyline")

export const INITIAL_ACTIVITY_LOAD = "INITIAL_ACTIVITY_LOAD"
export const initialActivityLoad = payload => {
  return {
    type: INITIAL_ACTIVITY_LOAD,
    payload: payload
  }
}

export const importStravaActivites = payload => {
  return async (dispatch, getState) => {
    await dispatch(makeStravaActivityRequests())

    const { activitiesToImport } = getState().stravaActivityImport

    for (let activity of activitiesToImport) {
      dispatch(addStravaImportRoute(googlePolyline.decode(activity.polyline)))
    }

    payload.goBack()
  }
}

export const makeStravaActivityRequests = () => {
  return async (dispatch, getState) => {
    const { selectedIds } = getState().stravaActivityImport
    let { stravaAccessToken } = getState().common.currentUser

    for (let id of selectedIds) {
      const activity = await requestForStravaActivity(id, stravaAccessToken)
      console.log('activity', activity.id)
      dispatch(addToActivitesToImport(activity))
    }

    console.log("all finished here in activity Requests")
  }
}

export const requestForStravaActivity = async (activityId, stravaAccessToken) => {
  let url = `https://www.strava.com/api/v3/activities/${activityId}`

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${stravaAccessToken}`
    }
  })

  const data = await response.json()
  let {
    id,
    map: { polyline }
  } = data
  return Object.assign({}, { id, polyline })

  // .then(response => {
  //   return response.json()
  // })
  // .then(data => {
  //   let {
  //     id,
  //     map: { polyline }
  //   } = data
  //   return Object.assign({}, { id, polyline })
  // })
  // .catch(err => {
  //   console.log("error!", err)
  //   if (err.status === 401) {
  //     console.log("error 401")
  //     // return logout()
  //   }
  // })
}

export const ADD_TO_ACTIVITY_TO_IMPORT = "ADD_TO_ACTIVITY_TO_IMPORT"
export const addToActivitesToImport = payload => {
  console.log("from the action", payload)
  return {
    type: ADD_TO_ACTIVITY_TO_IMPORT,
    payload: payload
  }
}

export const checkForExpiredToken = () => {
  return async (dispatch, getState) => {
    console.log("What in tarnation", getState().common.currentUser.stravaExpiresAt, Date.now())
    if (getState().common.currentUser.stravaExpiresAt < new Date().getTime() / 1000) {
      console.log("its expired!")
      dispatch(refreshAccessToken())
    } else {
      console.log("its still good")
      dispatch(loadInitialStravaData())
    }
  }
}

export const refreshAccessToken = () => {
  return async (dispatch, getState) => {
    const { stravaRefreshToken } = getState().common.currentUser
    const { stravaClientId, stravaClientSecret } = getState().common
    let url = "https://www.strava.com/oauth/token"
    let params = Object.assign(
      {},
      {
        client_id: stravaClientId,
        client_secret: stravaClientSecret,
        grant_type: "refresh_token",
        refresh_token: stravaRefreshToken
      }
    )
    url = url + encodeQueryString(params)

    fetch(url, {
      method: "POST"
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        dispatch(persistAccessToken(data))
        dispatch(loadInitialStravaData())
      })
      .catch(err => {
        console.log("error!", err)
        if (err.status === 401) {
          console.log("error 401")
          // return logout()
        }
      })
  }
}

export const loadInitialStravaData = () => {
  return async (dispatch, getState) => {
    const url = "https://www.strava.com/api/v3/athlete/activities?per_page=50"
    const { stravaAccessToken } = getState().common.currentUser
    const distance = getState().chapter.chapter.distance

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${stravaAccessToken}`
      }
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        let shapedRoutes = shapeRoutesForRender(data, distance)
        dispatch(initialActivityLoad(shapedRoutes))
      })
      .catch(err => {
        console.log("error!", err)
        if (err.status === 401) {
          console.log("error 401")
          // return logout()
        }
      })
  }
}

export const ADD_TO_SELECTED_IDS = "ADD_TO_SELECTED_IDS"
export const addToSelectedIds = payload => {
  return {
    type: ADD_TO_SELECTED_IDS,
    payload: payload
  }
}

export const REMOVE_FROM_SELECTED_IDS = "REMOVE_FROM_SELECTED_IDS"
export const removeFromSelectedIds = payload => {
  return {
    type: REMOVE_FROM_SELECTED_IDS,
    payload: payload
  }
}

const shapeRoutesForRender = (activityArray, chapterDistance) => {
  // figure out if distance changes depending on what it is
  let distanceObj
  let distance
  let date

  return activityArray.map((activity, index) => {
    distance = updateDistanceToChapter(activity.distance, chapterDistance)
    date = generateReadableDate(activity.start_date)

    return Object.assign({}, { id: activity.id, name: activity.name, distance: distance, date: date })
  })
}

const updateDistanceToChapter = (distance, chapterDistanceObj) => {
  let stringDistance = Math.round(distance / 1000)

  if (chapterDistanceObj.type === "mile") {
    stringDistance = Math.round(stringDistance * 0.6)
  }

  return `${stringDistance} ${chapterDistanceObj.readableDistanceType}`
}

const MONTHS = [
  "January",
  "Feburary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]

export const generateReadableDate = startDate => {
  let date = new Date(startDate)

  let month = MONTHS[date.getMonth()]
  let day = " " + date.getDate() + ", "
  let year = date.getFullYear()

  return month + day + year
}
