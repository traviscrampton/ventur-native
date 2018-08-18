import React, { Component } from "react"
import { createStore, combineReducers, applyMiddleware } from "redux"
import { Provider } from "react-redux"
import logger from "redux-logger"
import allReducers from "reducers/all_reducers"
import { createStackNavigator, createSwitchNavigator } from "react-navigation"
import { Ventur } from "navigation"
import { getCurrentUser } from "auth"
import { SET_CURRENT_USER } from "actions/action_types"
import thunk from "redux-thunk"
import { AsyncStorage } from "react-native"
import { Font } from "expo"

const store = createStore(allReducers, applyMiddleware(thunk))

export default class App extends Component {
  componentWillMount() {
    this.setCurrentUser()
    Font.loadAsync({
      "open-sans-regular": require("assets/fonts/Open_Sans/OpenSans-Regular.ttf"),
      playfair: require("assets/fonts/Playfair_Display/PlayfairDisplay-Bold.ttf"),
      overpass: require("assets/fonts/Overpass_Mono/OverpassMono-Light.ttf"),
      "open-sans-bold": require("assets/fonts/Open_Sans/OpenSans-Bold.ttf")
    })
  }

  async setCurrentUser() {
    try {
      let user = await AsyncStorage.getItem("currentUser")
      store.dispatch({ type: SET_CURRENT_USER, payload: JSON.parse(user) })
    } catch (err) {
      return null
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
