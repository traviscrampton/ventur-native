import _superagent from "superagent"
import superagentPromise from "superagent-promise"
import request from "superagent"
import { AsyncStorage } from "react-native"
import { logOut } from "auth"

const ql = require("superagent-graphql")
//export const API_ROOT = "http://192.168.7.23:3000"
export const API_ROOT = "http://localhost:3000"

const responseBody = res => res.body.data

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
      return err
    })
}
