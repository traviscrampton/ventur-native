import React, { Component } from "react"
import { createStackNavigator } from "react-navigation"
import { connect } from "react-redux"
import JournalFeed from "components/journals/journal_feed"
import Journal from "components/journals/journal"

const Navigation = createStackNavigator(
	{
		JournalFeed: JournalFeed
	},
	{
		Journal: Journal,
	},
	{
		initialRouteName: "JournalFeed"
	}
)

class Navigator extends Component {
	render() {
		return <Navigation />
	}
}

export default Navigator
