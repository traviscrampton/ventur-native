import { combineReducers } from "redux"

import journals from "reducers/journals"
import navigation from "reducers/navigation"

export default combineReducers({
	journals,
	navigation
})
