import _superagent from "superagent"
import superagentPromise from "superagent-promise"
import request from "superagent"
import { AsyncStorage } from "react-native"
import DropDownHolder from "./utils/DropdownHolder"
import { logOut } from "./auth"

const ql = require("superagent-graphql")
// export const API_ROOT = "http://10.223.78.206:3000"
// export const API_ROOT = "http://0.0.0.0:3000"
// export const API_ROOT = "http://192.168.1.80:3000"
// export const API_ROOT = "http://localhost:3000"
export const API_ROOT = "https://aqueous-sea-94280.herokuapp.com"

export const setToken = async () => {
  let token
  try {
    token = await AsyncStorage.getItem("JWT")
    if (token) {
      return `Token ${token}`
    }
  } catch (err) {
    return null
  }
}

export const encodeQueryString = params => {
  const keys = Object.keys(params)
  return keys.length
    ? "?" + keys.map(key => encodeURIComponent(key) + "=" + encodeURIComponent(params[key])).join("&")
    : ""
}

export const getCredentials = async () => {
  const token = await setToken()
  const requestRoute = "https://aqueous-sea-94280.herokuapp.com/credentials"

  return fetch(requestRoute, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    }
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      return data
    })
    .catch(err => {
      if (err.status === 401) {
        return logOut()
      }

      DropDownHolder.alert("error", "Error", err.message)
    })
}

export const get = async (route, params = {}) => {
  const token = await setToken()
  const requestRoute = API_ROOT + route + encodeQueryString(params)

  return fetch(requestRoute, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    }
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      return data
    })
    .catch(err => {
      if (err.status === 401) {
        return logOut()
      }

      DropDownHolder.alert("error", "Error", err.message)
    })
}

export const put = async (route, params = {}) => {
  const token = await setToken()
  const requestRoute = API_ROOT + route

  return fetch(requestRoute, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify(params)
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      return data
    })
    .catch(err => {
      if (err.status === 401) {
        return logout()
      }

      DropDownHolder.alert("error", "Error", err.message)
    })
}

export const post = async (route, params = {}) => {
  const token = await setToken()
  const requestRoute = API_ROOT + route

  return fetch(requestRoute, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify(params)
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      return data
    })
    .catch(err => {
      if (err.status === 401) {
        return logout()
      }

      DropDownHolder.alert("error", "Error", err.message)
    })
}

export const destroy = async (route, params = {}) => {
  const token = await setToken()
  const requestRoute = API_ROOT + route

  return fetch(requestRoute, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify(params)
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      return data
    })
    .catch(err => {
      if (err.status === 401) {
        return logout()
      }

      DropDownHolder.alert("error", "Error", err.message)
    })
}

export const gql = async (queryString, queryVariables = {}) => {
  const token = await setToken()
  return request
    .post(`${API_ROOT}/graphql`)
    .set("Accept", "application/json")
    .set("Authorization", token)
    .use(ql(queryString, queryVariables))
    .then(res => {
      return res.body.data
    })
    .catch(err => {
      if (err.status === 401) {
        return logOut()
      }

      DropDownHolder.alert("error", "Error", err.message)
    })
}
