import React, { Component } from "react"
import { createStackNavigator, createSwitchNavigator, createBottomTabNavigator } from "react-navigation"
import JournalFeed from "./components/journals/JournalFeed"
import Journal from "./components/journals/journal"
import StravaLogin from "./components/users/StravaLogin"
import HomeLoggedOut from "./components/users/HomeLoggedOut"
import BottomTabBar from "./components/shared/BottomTabBar"
import ImageCaptionForm from "./components/editor/ImageCaptionForm"
import ChapterDispatch from "./components/chapters/ChapterDispatch"
import ManageContent from "./components/editor/ManageContent"
import Profile from "./components/users/Profile"
import CommentForm from "./components/Comments/CommentForm"
import JournalForm from "./components/JournalForm/JournalForm"
import CountriesEditor from "./components/JournalForm/CountriesEditor"
import UserAvatarForm from "./components/users/UserAvatarForm"
import RouteEditor from "./components/Maps/RouteEditor"
import StravaRouteSelector from "./components/Maps/StravaRouteSelector"
import RouteViewer from "./components/Maps/RouteViewer"
import JournalRoute from "./components/Maps/JournalRoute"
import ChapterMetaDataForm from "./components/editor/ChapterMetaDataForm"
import ChapterEditor from "./components/chapters/ChapterEditor"
import GearItemReview from "./components/GearItemReview/GearItemReview"

const NO_FOOTER_SCREENS = [
  "Chapter",
  "ImageCaptionForm",
  "ManageContent",
  "RouteEditor",
  "RouteViewer",
  "JournalRoute",
  "JournalForm",
  "CountriesEditor",
  "ChapterEditor",
  "ChapterMetaDataForm",
  "StravaRouteSelector"
]

const JournalFeedNavigator = createStackNavigator(
  {
    JournalFeed: JournalFeed,
    Journal: Journal,
    Chapter: ChapterDispatch,
    ChapterMetaDataForm: ChapterMetaDataForm,
    CommentForm: CommentForm,
    ImageCaptionForm: ImageCaptionForm,
    ManageContent: ManageContent,
    JournalForm: JournalForm,
    CountriesEditor: CountriesEditor,
    RouteEditor: RouteEditor,
    RouteViewer: RouteViewer,
    JournalRoute: JournalRoute,
    ChapterEditor: ChapterEditor,
    StravaRouteSelector: StravaRouteSelector,
    GearItemReview: GearItemReview
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
    ChapterMetaDataForm: ChapterMetaDataForm,
    CommentForm: CommentForm,
    ImageCaptionForm: ImageCaptionForm,
    JournalForm: JournalForm,
    CountriesEditor: CountriesEditor,
    RouteEditor: RouteEditor,
    RouteViewer: RouteViewer,
    JournalRoute: JournalRoute,
    ManageContent: ManageContent,
    ChapterEditor: ChapterEditor,
    StravaRouteSelector: StravaRouteSelector,
    GearItemReview: GearItemReview
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
    HomeLoggedOut: HomeLoggedOut
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
