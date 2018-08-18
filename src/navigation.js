import React, { Component } from "react"
import { createStackNavigator, createSwitchNavigator, createBottomTabNavigator } from "react-navigation"
import JournalFeed from "components/journals/journal_feed"
import MyJournals from "components/journals/my_journals"
import Journal from "components/journals/journal"
import Login from "components/users/login"
import Editor from "components/editor/editor"
import BottomTabBar from "components/shared/bottom_tab_bar"
import CameraRollContainer from "components/editor/camera_roll_container"
import ImageCaptionForm from "components/editor/image_caption_form"
import ManageContent from "components/editor/manage_content"
import { Text } from "react-native"
import { isSignedIn } from "auth"

const JournalFeedNavigator = createStackNavigator(
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

const MyJournalsNavigator = createStackNavigator(
  {
    MyJournals: MyJournals,
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

const RootNavigator = (signedIn = false) =>
  createSwitchNavigator(
    {
      Login: Login,
      JournalFeed: JournalFeedNavigator,
      Editor: EditorNavigator
    },
    {
      initialRouteName: signedIn ? "JournalFeed" : "Login"
    }
  )

const BottomNavigator = createBottomTabNavigator(
  {
    Explore: RootNavigator(isSignedIn()),
    Saved: Editor,
    Add: Login,
    "My Trips": MyJournalsNavigator,
    Profile: Editor
  },
  {
    tabBarComponent: BottomTabBar
  },
  {
    initialRouteName: "Explore"
  }
)
export const Ventur = BottomNavigator
