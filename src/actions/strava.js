import { Linking } from "react-native"
import { encodeQueryString } from "agent"
import { WebBrowser } from "expo"
import { post } from "agent"
import { AsyncStorage } from "react-native"
import { setCurrentUser } from "actions/common"

export const authenticateStravaUser = result => {
  return async (dispatch, getState) => {
    const code = getCodeFromUrl(result)
    dispatch(validateUser(code)).then(response => {
      dispatch(persistAccessToken(response.access_token))
    })
  }
}

const getCodeFromUrl = result => {
  const { url } = result
  const params = getUrlParams(url)
  return params.code
}

export const persistAccessToken = authToken => {
  return async (dispatch, getState) => {
    let user
    let params = Object.assign({}, { authToken: authToken })

    post("/users/update_strava_token", params).then(response => {
      const { user } = response
      AsyncStorage.setItem("currentUser", JSON.stringify(user))
      dispatch(setCurrentUser(user))
    })
  }
}

export const validateUser = code => {
  return async (dispatch, getState) => {
    let { stravaClientId, stravaClientSecret } = getState().common
    let url = "https://www.strava.com/oauth/token"

    const params = Object.assign(
      {},
      {
        client_id: stravaClientId,
        client_secret: stravaClientSecret,
        grant_type: "authorization_code",
        code: code
      }
    )

    url = url + encodeQueryString(params)

    return fetch(url, {
      method: "POST"
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        return data
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

export const getUrlParams = url => {
  let hashes = url.slice(url.indexOf("?") + 1).split("&")
  let params = {}
  hashes.map(hash => {
    let [key, val] = hash.split("=")
    params[key] = decodeURIComponent(val)
  })

  return params
}

export const getActivities = () => {
  const url = "https://www.strava.com/api/v3/athlete/activities?per_page=60"
  const accessToken = "caeaf06fd8bfffd3d6d3a245ce9519ca0de889b7"

  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      console.log("DADA", data)
      return data
    })
    .catch(err => {
      console.log("error!", err)
      if (err.status === 401) {
        console.log("error 401")
        // return logout()
      }
    })
}
