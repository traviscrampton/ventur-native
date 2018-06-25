import { Navigator } from "../navigator"
import { NavigationActions } from "react-navigation"

export default (state = {}, action) => {
	// Our Navigator's router is now responsible for
	// creating our navigation state object
	return { ...state }
}
