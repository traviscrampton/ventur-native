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
import { AsyncStorage, View } from "react-native"
import { RootNavigator } from "navigation"
import { Ventur } from "navigation"
import DropdownAlert from "react-native-dropdownalert"
import { Font } from "expo"
import DropDownHolder from "utils/DropdownHolder"

const store = createStore(allReducers, applyMiddleware(thunk))

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
    let journals = await AsyncStorage.getItem("journals")
    // await AsyncStorage.setItem("chapters", JSON.stringify([]))
    if (!chapters) {
      await AsyncStorage.setItem("chapters", JSON.stringify([]))
    } else if (!journals) {
      await AsyncStorage.setItem("journals", JSON.stringify([]))
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
      <React.Fragment>
        <Provider store={store}>
          <Ventur />
        </Provider>
        <DropdownAlert ref={ref => DropDownHolder.setDropDown(ref)} closeInterval={6000} />
      </React.Fragment>
    )
  }
}
