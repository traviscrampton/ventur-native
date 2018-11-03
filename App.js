import React, { Component } from "react"
import { createStore, combineReducers, applyMiddleware } from "redux"
import { Provider } from "react-redux"
import logger from "redux-logger"
import allReducers from "reducers/all_reducers"
import { createStackNavigator } from "react-navigation"
import { getCurrentUser } from "auth"
import { SET_CURRENT_USER } from "actions/action_types"
import { INITIAL_APP_LOADED } from "actions/common"
import thunk from "redux-thunk"
import { AsyncStorage } from "react-native"
import { RootNavigator } from "navigation"
import { Ventur } from "navigation"
import { Font } from "expo"

const store = createStore(allReducers, applyMiddleware(thunk))

const SplashScreen = () => {
  return (
    <View>
      <Text>Its a big time slash screen</Text>
    </View>
  )
}

export default class App extends Component {
  componentWillMount() {
    Font.loadAsync({
      "open-sans-regular": require("assets/fonts/Lato/Lato-Regular.ttf"),
      playfair: require("assets/fonts/Lato/Lato-Bold.ttf"),
      overpass: require("assets/fonts/Lato/Lato-Light.ttf"),
      "open-sans-bold": require("assets/fonts/Lato/Lato-Hairline.ttf"),
      "open-sans-semi": require("assets/fonts/Lato/Lato-Light.ttf")
    })
    this.setCurrentUser()
    this.setChaptersForAsyncStorage()
  }

  async setChaptersForAsyncStorage() {
    let chapters = await AsyncStorage.getItem("chapters")
    if (!chapters) {
      await AsyncStorage.setItem("chapters", JSON.stringify([]))
    }
  }

  async setCurrentUser() {
    try {
      let user = await AsyncStorage.getItem("currentUser")
      store.dispatch({ type: SET_CURRENT_USER, payload: JSON.parse(user) })
      store.dispatch({ type: INITIAL_APP_LOADED })
    } catch (err) {
      store.dispatch({ type: SET_CURRENT_USER, payload: null })
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Ventur />
      </Provider>
    )
  }
}
