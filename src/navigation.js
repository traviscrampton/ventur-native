import React, { Component } from "react"
import { createStackNavigator, createSwitchNavigator } from "react-navigation"
import JournalFeed from "components/journals/journal_feed"
import Journal from "components/journals/journal"
import Login from "components/users/login"
import Editor from "components/editor/editor"
import CameraRollContainer from "components/editor/camera_roll_container"
import ImageCaptionForm from "components/editor/image_caption_form"
import ManageContent from "components/editor/manage_content"
import { Text } from "react-native"
import { isSignedIn } from "auth"

const JournalNavigator = createStackNavigator({
  JournalFeed: JournalFeed,
  Journal: Journal
})

const EditorNavigator = createStackNavigator(
  {
    Editor: Editor,
    CameraRollContainer: CameraRollContainer,
    ImageCaptionForm: ImageCaptionForm,
    ManageContent: ManageContent
  },
  {
    headerMode: "none",
    navigationOptions: {
      headerVisible: false
    }
  }
)

const signedIn = isSignedIn()

const RootNavigator = (signedIn = false) =>
  createSwitchNavigator(
    {
      Login: Login,
      JournalFeed: JournalNavigator,
      Editor: EditorNavigator
    },
    {
      initialRouteName: signedIn ? "Editor" : "Editor"
    }
  )

export const Ventur = RootNavigator(signedIn)
