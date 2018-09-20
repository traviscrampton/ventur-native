import _superagent from "superagent"
import superagentPromise from "superagent-promise"
import request from "superagent"
import { AsyncStorage } from "react-native"
const ql = require("superagent-graphql")
const API_ROOT = "http://192.168.7.23:3000"
const responseBody = res => res.body.data

export const setToken = async () => {
  let token
  try {
    token = await AsyncStorage.getItem("JWT")
    return `Token ${token}`
  } catch (err) {
    return null
  }
}

export const gql = async (queryString, queryVariables = {}) => {
  const token = await setToken()
  console.log(token)
  return request
    .post(`${API_ROOT}/graphql`)
    .set("Accept", "application/json")
    .set("Authorization", token)
    .use(ql(queryString, queryVariables))
    .then(responseBody)
}
