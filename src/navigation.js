import React, { Component } from "react"
import { createStackNavigator, createSwitchNavigator } from "react-navigation"
import JournalFeed from "components/journals/journal_feed"
import Journal from "components/journals/journal"
import Login from "components/users/login"
import { isSignedIn } from "auth"

const JournalNavigator = createStackNavigator({
  JournalFeed: JournalFeed,
  Journal: Journal
})

const signedIn = isSignedIn()

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

export const Ventur = RootNavigator(signedIn)
