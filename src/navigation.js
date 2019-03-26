import React, { Component } from "react"
import { createStackNavigator, createSwitchNavigator, createBottomTabNavigator } from "react-navigation"
import JournalFeed from "components/journals/JournalFeed"
import Journal from "components/journals/journal"
import Login from "components/users/login"
import HomeLoggedOut from "components/users/HomeLoggedOut"
import BottomTabBar from "components/shared/BottomTabBar"
import CameraRollContainer from "components/editor/CameraRollContainer"
import ImageCaptionForm from "components/editor/ImageCaptionForm"
import ChapterDispatch from "components/chapters/ChapterDispatch"
import ManageContent from "components/editor/ManageContent"
import JournalFormTitle from "components/JournalForm/JournalFormTitle"
import JournalFormLocation from "components/JournalForm/JournalFormLocation"
import JournalFormStatus from "components/JournalForm/JournalFormStatus"
import JournalFormUpload from "components/JournalForm/JournalFormUpload"
import Profile from "components/users/Profile"
import ChapterFormJournals from "components/ChapterForm/ChapterFormJournals"
import UserEmailPasswordForm from "components/users/UserEmailPasswordForm"
import UserNameForm from "components/users/UserNameForm"
import CommentForm from "components/Comments/CommentForm"
import UserAvatarForm from "components/users/UserAvatarForm"
import RouteEditor from "components/Maps/RouteEditor"
import RouteViewer from "components/Maps/RouteViewer"

const NO_FOOTER_SCREENS = [
  "Chapter",
  "ChapterFormJournals",
  "ChapterFormTitle",
  "ChapterFormDate",
  "ChapterFormDistance",
  "ChapterFormUpload",
  "CameraRollContainer",
  "ImageCaptionForm",
  "ManageContent",
  "Login",
  "JournalFormTitle",
  "JournalFormLocation",
  "JournalFormStatus",
  "JournalFormUpload",
  "RouteEditor",
  "RouteViewer"
]

const JournalFeedNavigator = createStackNavigator(
  {
    JournalFeed: JournalFeed,
    Journal: Journal,
    Chapter: ChapterDispatch,
    CommentForm: CommentForm,
    CameraRollContainer: CameraRollContainer,
    ImageCaptionForm: ImageCaptionForm,
    ManageContent: ManageContent,
    JournalFormTitle: JournalFormTitle,
    JournalFormLocation: JournalFormLocation,
    JournalFormStatus: JournalFormStatus,
    RouteEditor: RouteEditor,
    RouteViewer: RouteViewer,
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

const ProfileNavigator = createStackNavigator(
  {
    Profile: Profile,
    Journal: Journal,
    Chapter: ChapterDispatch,
    CommentForm: CommentForm,
    CameraRollContainer: CameraRollContainer,
    JournalFormTitle: JournalFormTitle,
    JournalFormLocation: JournalFormLocation,
    JournalFormStatus: JournalFormStatus,
    ImageCaptionForm: ImageCaptionForm,
    JournalFormUpload: JournalFormUpload,
    RouteEditor: RouteEditor,
    RouteViewer: RouteViewer,
    ManageContent: ManageContent,
    ChapterFormJournals: ChapterFormJournals
  },
  {
    initialRouteName: "Profile",
    headerMode: "none",
    headerTransparent: true,
    headerStyle: {
      borderBottomWidth: 0
    }
  }
)

const AuthFlow = createStackNavigator(
  {
    HomeLoggedOut: HomeLoggedOut,
    Login: Login,
    UserEmailPasswordForm: UserEmailPasswordForm,
    UserNameForm: UserNameForm,
    UserAvatarForm: UserAvatarForm
  },
  {
    initialRouteName: "HomeLoggedOut",
    headerMode: "none",
    headerTransparent: true,
    headerStyle: {
      borderBottomWidth: 0
    }
  }
)

JournalFeedNavigator.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index]
  let navigationOptions = {}
  if (NO_FOOTER_SCREENS.includes(routeName)) {
    navigationOptions.tabBarVisible = false
  }
  return navigationOptions
}

AuthFlow.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index]
  let navigationOptions = {}
  if (NO_FOOTER_SCREENS.includes(routeName)) {
    navigationOptions.tabBarVisible = false
  }
  return navigationOptions
}

ProfileNavigator.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index]
  let navigationOptions = {}
  if (NO_FOOTER_SCREENS.includes(routeName)) {
    navigationOptions.tabBarVisible = false
  }
  return navigationOptions
}

export const RootNavigator = (signedIn = false) =>
  createSwitchNavigator(
    {
      AuthFlow: AuthFlow,
      BottomNavigator: BottomNavigator
    },
    {
      initialRouteName: signedIn ? "BottomNavigator" : "AuthFlow"
    }
  )

const BottomNavigator = createBottomTabNavigator(
  {
    Explore: JournalFeedNavigator,
    Profile: ProfileNavigator
  },
  {
    initialRouteName: "Explore",
    tabBarComponent: BottomTabBar
  }
)
