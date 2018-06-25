import _superagent from "superagent"
import superagentPromise from "superagent-promise"
const ql = require("superagent-graphql")
const superagent = superagentPromise(_superagent, global.Promise)

const API_ROOT = "http://localhost:3000"

const agent = {}

const graphQL = (queryString, queryVariables) => {
	superagent
		.post(`${API_ROOT}/graphql`)
		.use(ql(queryString, queryVariables))
		.then()
}

export default { agent }
