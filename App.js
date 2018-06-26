import React, { Component } from "react"
import { createStore, combineReducers, applyMiddleware } from "redux"
import { Provider } from "react-redux"
import logger from "redux-logger"
import  allReducers from "reducers/all_reducers"
import Navigation from "./src/navigator"

const store = createStore(allReducers, applyMiddleware(logger))

export default class App extends Component {

	render() {
		return (
			<Provider store={store}>
				<Navigation/>
			</Provider>
		)
	}
}
