import React, { Component } from "react"
import { createStore, combineReducers, applyMiddleware } from "redux"
import { Provider } from "react-redux"
import logger from "redux-logger"
import allReducers from "./src/reducers/all_reducers"
import thunk from "redux-thunk"
import { AsyncStorage, View } from "react-native"
import DropdownAlert from "react-native-dropdownalert"
import { Font } from "expo"
import { registerRootComponent } from "expo"
import DropDownHolder from "./src/utils/DropdownHolder"
import Ventur from "./src/components/Ventur"
import { ActionSheetProvider } from "@expo/react-native-action-sheet"

const store = createStore(allReducers, applyMiddleware(thunk))

export default class App extends Component {
  render() {
    return (
      <React.Fragment>
        <ActionSheetProvider>
          <Provider store={store}>
            <Ventur />
          </Provider>
        </ActionSheetProvider>
        <DropdownAlert ref={ref => DropDownHolder.setDropDown(ref)} closeInterval={6000} />
      </React.Fragment>
    )
  }
}

registerRootComponent(App)
