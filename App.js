import React, { Component } from "react"
import { createStore, combineReducers, applyMiddleware } from "redux"
import { Provider } from "react-redux"
import logger from "redux-logger"
import allReducers from "reducers/all_reducers"
import thunk from "redux-thunk"
import { AsyncStorage, View } from "react-native"
import DropdownAlert from "react-native-dropdownalert"
import { Font } from "expo"
import DropDownHolder from "utils/DropdownHolder"
import Ventur from "components/Ventur"

const store = createStore(allReducers, applyMiddleware(thunk))

export default class App extends Component {
  componentWillMount() {
    Font.loadAsync({
      "open-sans-regular": require("assets/fonts/Open_Sans/OpenSans-Regular.ttf"),
      playfair: require("assets/fonts/Playfair_Display/PlayfairDisplay-Bold.ttf"),
      overpass: require("assets/fonts/Overpass_Mono/OverpassMono-Regular.ttf"),
      "open-sans-bold": require("assets/fonts/Open_Sans/OpenSans-Bold.ttf"),
      "open-sans-semi": require("assets/fonts/Lato/Lato-Light.ttf")
    })
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
