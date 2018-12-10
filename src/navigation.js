import React, { Component } from "react"
import { createStackNavigator, createSwitchNavigator, createBottomTabNavigator } from "react-navigation"
import JournalFeed from "components/journals/JournalFeed"
import MyJournals from "components/journals/MyJournals"
import Journal from "components/journals/Journal"
import Login from "components/users/Login"
import HomeLoggedOut from "components/users/HomeLoggedOut"
import ContentCreate from "components/modals/ContentCreate"
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
import Profile from "components/users/Profile"
import ChapterFormDistance from "components/ChapterForm/ChapterFormDistance"
import ChapterFormTitle from "components/ChapterForm/ChapterFormTitle"
import ChapterFormDate from "components/ChapterForm/ChapterFormDate"
import ChapterFormJournals from "components/ChapterForm/ChapterFormJournals"
import ChapterFormUpload from "components/ChapterForm/ChapterFormUpload"
import UserEmailPasswordForm from "components/users/UserEmailPasswordForm"
import UserNameForm from "components/users/UserNameForm"
import UserAvatarForm from "components/users/UserAvatarForm"
import { Text } from "react-native"
import { isSignedIn } from "auth"

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
  "JournalFormUpload"
]

const signedIn = async () => {
  await isSignedIn().then(res => {
    return res
  })
}

const JournalFeedNavigator = createStackNavigator(
  {
    JournalFeed: JournalFeed,
    Journal: Journal,
    Chapter: ChapterDispatch,
    ChapterFormTitle: ChapterFormTitle,
    ChapterFormDate: ChapterFormDate,
    ChapterFormDistance: ChapterFormDistance,
    ChapterFormUpload: ChapterFormUpload,
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

const ProfileNavigator = createStackNavigator(
  {
    Profile: Profile,
    Journal: Journal,
    Chapter: ChapterDispatch,
    JournalFormTitle: JournalFormTitle,
    JournalFormLocation: JournalFormLocation,
    JournalFormStatus: JournalFormStatus,
    ImageCaptionForm: ImageCaptionForm,
    JournalFormUpload: JournalFormUpload,
    ManageContent: ManageContent,
    ChapterFormJournals: ChapterFormJournals,
    ChapterFormTitle: ChapterFormTitle,
    ChapterFormDistance: ChapterFormDistance,
    CameraRollContainer: CameraRollContainer,
    ChapterFormDate: ChapterFormDate,
    ChapterFormUpload: ChapterFormUpload
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
