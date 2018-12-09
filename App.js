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
