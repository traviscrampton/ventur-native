import _superagent from "superagent"
import superagentPromise from "superagent-promise"
import request from "superagent"
import { AsyncStorage } from "react-native"
const ql = require("superagent-graphql")
const API_ROOT = "http://localhost:3000"
const responseBody = res => res.body.data

export const storeJWT = async (token, currentUser) => {
  try {
    await AsyncStorage.setItem("JWT", token)
    await AsyncStorage.setItem("currentUser", currentUser)
  } catch (error) {
    console.log(error)
  }
}

export const isSignedIn = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem("JWT")
      .then(res => {
        if (res !== null) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
      .catch(err => reject(err))
  })
}

const setToken = () => {
  const token = AsyncStorage.getItem("JWT")
}

export const gql = (queryString, queryVariables = {}) => {
  return request
    .post(`${API_ROOT}/graphql`)
    .set("Accept", "application/json")
    .set("Authorization", setToken())
    .use(ql(queryString, queryVariables))
    .then(responseBody)
}
