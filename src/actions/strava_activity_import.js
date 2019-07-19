export const INITIAL_ACTIVITY_LOAD = "INITIAL_ACTIVITY_LOAD"
export const initialActivityLoad = payload => {
  return {
    type: INITIAL_ACTIVITY_LOAD,
    payload: payload
  }
}

export const loadInitialStravaData = () => {
  return async (dispatch, getState) => {
    const url = "https://www.strava.com/api/v3/athlete/activities?per_page=20"
    const { stravaAuthToken } = getState().common.currentUser
    const distance = getState().chapter.chapter.distance

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${stravaAuthToken}`
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
export const addToSelectedIds = (payload) => {
  return {
    type: ADD_TO_SELECTED_IDS,
    payload: payload
  }
}

export const REMOVE_FROM_SELECTED_IDS = "REMOVE_FROM_SELECTED_IDS" 
export const removeFromSelectedIds = (payload) => {
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
