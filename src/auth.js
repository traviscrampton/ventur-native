import { AsyncStorage } from "react-native"
import { SET_CURRENT_USER } from "./actions/action_types"

export const storeJWT = async obj => {
  console.log("objecthere", obj)
  try {
    AsyncStorage.setItem("JWT", obj.token)
    AsyncStorage.setItem("currentUser", JSON.stringify(obj.user))
  } catch (error) {
    console.log(error)
  }
}

export const getCurrentUser = async () => {
  try {
    await AsyncStorage.getItem("currentUser")
  } catch (error) {
    console.log(error)
  }
}

export const logOut = async () => {
  try {
    AsyncStorage.removeItem("JWT")
    AsyncStorage.removeItem("currentUser")
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
