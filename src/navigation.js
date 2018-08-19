import React, { Component } from "react"
import { createStackNavigator, createSwitchNavigator, createBottomTabNavigator } from "react-navigation"
import JournalFeed from "components/journals/journal_feed"
import MyJournals from "components/journals/my_journals"
import Journal from "components/journals/journal"
import Login from "components/users/login"
import ContentCreate from "components/modals/content_create"
import Editor from "components/editor/editor"
import BottomTabBar from "components/shared/bottom_tab_bar"
import CameraRollContainer from "components/editor/camera_roll_container"
import ImageCaptionForm from "components/editor/image_caption_form"
import ManageContent from "components/editor/manage_content"
import BannerImagePicker from "components/journals/banner_image_picker"
import JournalForm from "components/journals/journal_form"
import { Text } from "react-native"
import { isSignedIn } from "auth"

const signedIn = isSignedIn()

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

const ContentCreateNavigator = createStackNavigator(
  {
    ContentCreate: ContentCreate,
    BannerImagePicker: BannerImagePicker
  },
  {
    mode: "modal",
    headerMode: "none",
    cardStyle: {
      opacity: 1
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
    },
    initialRouteName: "MyJournals"
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
      Editor: EditorNavigator,
      JournalForm: JournalForm
    },
    {
      initialRouteName: signedIn ? "JournalFeed" : "Login"
    }
  )

const BottomNavigator = createBottomTabNavigator(
  {
    Explore: RootNavigator(signedIn),
    Saved: Editor,
    Add: ContentCreateNavigator,
    "My Trips": MyJournalsNavigator,
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
