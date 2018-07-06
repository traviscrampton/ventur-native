import _superagent from "superagent"
import superagentPromise from "superagent-promise"
import request from "superagent"
const ql = require("superagent-graphql")
const API_ROOT = "http://localhost:3000"
const responseBody = res => res.body.data

// still need abstract out sign in and sign out functions
// add token here, add check for token here 
// figure out how to handle errors

export const gql = (queryString, queryVariables = {}) => {
  return request
    .post(`${API_ROOT}/graphql`)
    .use(ql(queryString, queryVariables))
    .then(responseBody)
}
