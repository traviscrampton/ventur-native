import React, { Component } from "react"
import { createStackNavigator, createSwitchNavigator } from "react-navigation"
import JournalFeed from "components/journals/journal_feed"
import Journal from "components/journals/journal"
import Login from "components/users/login"
import Editor from "components/editor/editor"
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
      JournalFeed: JournalNavigator,
      Editor: Editor
    },
    {
      initialRouteName: signedIn ? "Editor" : "Editor"
    }
  )

export const Ventur = RootNavigator(signedIn)
