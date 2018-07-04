import React, { Component } from "react"
import { createStore, combineReducers, applyMiddleware } from "redux"
import { Provider } from "react-redux"
import logger from "redux-logger"
import allReducers from "reducers/all_reducers"
import { createStackNavigator, createSwitchNavigator } from "react-navigation"
import JournalFeed from "components/journals/journal_feed"
import Journal from "components/journals/journal"
import Login from "components/users/login"
import isSignedIn from "./src/auth.js"

const store = createStore(allReducers, applyMiddleware(logger))

const JournalNavigator = createStackNavigator({
	JournalFeed: JournalFeed,
	Journal: Journal
})

const RootNavigator = (signedIn = false) =>
	createSwitchNavigator(
		{
			Login: Login,
			JournalFeed: JournalNavigator
		},
		{
			initialRouteName: signedIn ? "JournalFeed" : "Login"
		}
	)

const Ventur = RootNavigator(isSignedIn)

export default class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<Ventur />
			</Provider>
		)
	}
}
