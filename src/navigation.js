import React, { Component } from "react"
import { createStackNavigator, createSwitchNavigator, createBottomTabNavigator } from "react-navigation"
import JournalFeed from "components/journals/journal_feed"
import Journal from "components/journals/journal"
import Login from "components/users/login"
import Editor from "components/editor/editor"
import BottomTabBar from "components/shared/bottom_tab_bar"
import CameraRollContainer from "components/editor/camera_roll_container"
import ImageCaptionForm from "components/editor/image_caption_form"
import ManageContent from "components/editor/manage_content"
import { Text } from "react-native"
import { isSignedIn } from "auth"

const JournalNavigator = createStackNavigator(
  {
    JournalFeed: JournalFeed,
    Journal: Journal
  },
  {
    navigationOptions: {
      headerTransparent: true,
      headerStyle: {
        borderBottomWidth: 0
      }
    }
  }
)

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
      initialRouteName: signedIn ? "JournalFeed" : "JournalFeed"
    }
  )

const BottomNavigator = createBottomTabNavigator(
  {
    "My Trips": RootNavigator(signedIn),
    Saved: Editor,
    Add: Login,
    Explore: Editor,
    Profile: Editor
  },
  {
    tabBarComponent: BottomTabBar
  },
  {
    initialRouteName: "My Trips"
  }
)
export const Ventur = BottomNavigator
