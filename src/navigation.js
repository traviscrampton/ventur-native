import React, { Component } from "react"
import { createStackNavigator, createSwitchNavigator, createBottomTabNavigator } from "react-navigation"
import JournalFeed from "components/journals/JournalFeed"
import MyJournals from "components/journals/MyJournals"
import Journal from "components/journals/Journal"
import Login from "components/users/Login"
import ContentCreate from "components/modals/ContentCreate"
import Editor from "components/editor/Editor"
import BottomTabBar from "components/shared/BottomTabBar"
import CameraRollContainer from "components/editor/CameraRollContainer"
import ImageCaptionForm from "components/editor/ImageCaptionForm"
import ChapterDispatch from "components/chapters/ChapterDispatch"
import ManageContent from "components/editor/ManageContent"
import BannerImagePicker from "components/journals/BannerImagePicker"
import JournalForm from "components/journals/JournalForm"
import JournalFormTitle from "components/JournalForm/JournalFormTitle"
import JournalFormLocation from "components/JournalForm/JournalFormLocation"
import JournalFormStatus from "components/JournalForm/JournalFormStatus"
import JournalFormUpload from "components/JournalForm/JournalFormUpload"
import ChapterFormDistance from "components/ChapterForm/ChapterFormDistance"
import ChapterFormTitle from "components/ChapterForm/ChapterFormTitle"
import { Text } from "react-native"
import { isSignedIn } from "auth"

const signedIn = async () => {
  await isSignedIn().then(res => {
    return res
  })
}

const JournalNavigation = createStackNavigator(
  {
    Journal: Journal,
    Chapter: ChapterDispatch
  },
  {
    initialRouteName: "Journal",
    headerMode: "none",
    headerTransparent: true,
    headerStyle: {
      borderBottomWidth: 0
    }
  }
)

const JournalCreateStackNavigator = createStackNavigator(
  {
    JournalFormTitle: JournalFormTitle,
    JournalFormLocation: JournalFormLocation,
    JournalFormStatus: JournalFormStatus,
    JournalFormUpload: JournalFormUpload,
    MyJournals: MyJournals
  },
  {
    initialRouteName: "JournalFormTitle",
    headerMode: "none"
  }
)

const JournalFeedNavigator = createStackNavigator(
  {
    JournalFeed: JournalFeed,
    Journal: Journal,
    Chapter: ChapterDispatch,
    ChapterFormTitle: ChapterFormTitle,
    ChapterFormDistance: ChapterFormDistance,
    BannerImagePicker: BannerImagePicker,
    CameraRollContainer: CameraRollContainer,
    ImageCaptionForm: ImageCaptionForm,
    ManageContent: ManageContent,
    JournalFormTitle: JournalFormTitle,
    JournalFormLocation: JournalFormLocation,
    JournalFormStatus: JournalFormStatus,
    JournalFormUpload: JournalFormUpload
  },
  {
    initialRouteName: "JournalFeed",
    headerMode: "none",
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

const CreatorNavigator = createStackNavigator(
  {
    Journal: JournalCreateStackNavigator,
    Chapter: EditorNavigator, // these are coming soon
    Gear: ContentCreate // these are coming soon
  },
  { headerMode: "none" }
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
    Chapter: ChapterDispatch,
    JournalFormTitle: JournalFormTitle,
    JournalFormLocation: JournalFormLocation,
    JournalFormStatus: JournalFormStatus,
    JournalFormUpload: JournalFormUpload,
    ChapterFormTitle: ChapterFormTitle,
    ChapterFormDistance: ChapterFormDistance,
    BannerImagePicker: BannerImagePicker
  },
  {
    initialRouteName: "MyJournals",
    headerMode: "none",
    headerTransparent: true,
    headerStyle: {
      borderBottomWidth: 0
    }
  }
)

export const RootNavigator = (signedIn = false) =>
  createSwitchNavigator(
    {
      Login: Login,
      BottomNavigator: BottomNavigator
    },
    {
      initialRouteName: signedIn ? "BottomNavigator" : "Login"
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
    "My Trips": MyJournalsNavigator,
    Gear: Editor,
    Profile: Editor
  },
  {
    tabBarComponent: BottomTabBar
  },
  {
    initialRouteName: "Explore"
  }
)

export const Ventur = RootNavigator(isSignedIn())
