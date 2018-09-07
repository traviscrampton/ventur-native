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
import ChapterDispatch from "components/chapters/ChapterDispatch"
import ManageContent from "components/editor/manage_content"
import BannerImagePicker from "components/journals/banner_image_picker"
import JournalForm from "components/journals/journal_form"
import { Text } from "react-native"
import { isSignedIn } from "auth"

const signedIn = isSignedIn()

const JournalNavigation = createStackNavigator(
  {
    Journal: Journal,
    Chapter: ChapterDispatch
  },
  {
    headerMode: "none",
    headerTransparent: true,
    headerStyle: {
      borderBottomWidth: 0
    }
  }
)

const JournalFeedNavigator = createStackNavigator(
  {
    JournalFeed: JournalFeed,
    Journal: Journal,
    Chapter: ChapterDispatch,
    CameraRollContainer: CameraRollContainer,
    ImageCaptionForm: ImageCaptionForm,
    ManageContent: ManageContent
  },
  {
    headerMode: "none",
    navigationOptions: {
      headerTransparent: true,
      headerStyle: {
        borderBottomWidth: 0
      }
    }
  }
)

const JournalCreateStackNavigator = createStackNavigator(
  {
    JournalForm: JournalForm,
    BannerImagePicker: BannerImagePicker
  },
  {
    headerMode: "none",
    initialRouteName: "JournalForm"
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

const CreatorNavigator = createBottomTabNavigator(
  {
    Journal: JournalCreateStackNavigator,
    Chapter: EditorNavigator, // these are coming soon
    Gear: ContentCreate // these are coming soon
  },
  { mode: "modal" }
)

const ContentCreateNavigator = createStackNavigator(
  {
    ContentCreate: ContentCreate,
    JournalForm: JournalForm,
    BannerImagePicker: BannerImagePicker,
    Journal: Journal
  },
  {
    mode: "modal",
    headerMode: "none",
    tabBarVisible: false,
    navigationOptions: ({ navigation }) => ({
      tabBarVisible: false
    })
  }
)

const MyJournalsNavigator = createStackNavigator(
  {
    MyJournals: MyJournals,
    Journal: Journal,
    Chapter: ChapterDispatch
  },
  {
    headerMode: "none",
    headerTransparent: true,
    headerStyle: {
      borderBottomWidth: 0
    }
  }
)

const RootNavigator = (signedIn = false) =>
  createSwitchNavigator(
    {
      Login: Login,
      JournalFeed: JournalFeedNavigator
    },
    {
      initialRouteName: signedIn ? "Login" : "Login"
    }
  )

const BottomNavigator = createBottomTabNavigator(
  {
    Explore: {
      screen: JournalFeedNavigator,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: navigation.state.index < 2
      })
    },
    Saved: Editor,
    Add: {
      screen: CreatorNavigator,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: false
      })
    },
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
