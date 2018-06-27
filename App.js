import React, { Component } from "react"
import { createStore, combineReducers, applyMiddleware } from "redux"
import { Provider } from "react-redux"
import logger from "redux-logger"
import allReducers from "reducers/all_reducers"
import { createStackNavigator } from "react-navigation"
import JournalFeed from "components/journals/journal_feed"
import Journal from "components/journals/journal"

const store = createStore(allReducers, applyMiddleware(logger))

const Navigator = createStackNavigator({
	JournalFeed: JournalFeed,
	Journal: Journal,
})

export default class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<Navigator />
			</Provider>
		)
	}
}
