import { AsyncStorage } from "react-native"
// this still doesn't work
const defaultAppState = {
  currentUser: AsyncStorage.getItem("currentUser")
}

export default (state = defaultAppState, action) => {
  switch (action.type) {
    default:
      return state
  }
}
