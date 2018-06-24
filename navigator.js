import React, { Component } from "react"
import { StackNavigator } from "react-navigation"

export const Navigator = new Stacknavigator(
	{
		journalFeed: { screen: JournalFeed }
	},
	{
		initialRouteName: "Feed"
	}
)

class Nav extends Component {
	render() {
		return <Navigator />
	}
}
