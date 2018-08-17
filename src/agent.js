import _superagent from "superagent"
import superagentPromise from "superagent-promise"
import request from "superagent"
import { AsyncStorage } from "react-native"
const ql = require("superagent-graphql")
const API_ROOT = "http://192.168.7.23:3000"
const responseBody = res => res.body.data

const setToken = () => { 
  // const token = AsyncStorage.getItem("JWT")
  const token = null
}

export const gql = (queryString, queryVariables = {}) => {
  return request
    .post(`${API_ROOT}/graphql`)
    .set("Accept", "application/json")
    .set("Authorization", setToken())
    .use(ql(queryString, queryVariables))
    .then(responseBody)
}
