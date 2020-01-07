import {
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator
} from 'react-navigation';
import JournalFeed from './components/journals/JournalFeed';
import Journal from './components/journals/journal';
import HomeLoggedOut from './components/users/HomeLoggedOut';
import BottomTabBar from './components/shared/BottomTabBar';
import ImageCaptionForm from './components/editor/ImageCaptionForm';
import ChapterDispatch from './components/chapters/ChapterDispatch';
import ManageContent from './components/editor/ManageContent';
import Profile from './components/users/Profile';
import CommentForm from './components/Comments/CommentForm';
import JournalForm from './components/JournalForm/JournalForm';
import CountriesEditor from './components/JournalForm/CountriesEditor';
import RouteEditor from './components/Maps/RouteEditor';
import StravaRouteSelector from './components/Maps/StravaRouteSelector';
import RouteViewer from './components/Maps/RouteViewer';
import JournalRoute from './components/Maps/JournalRoute';
import ChapterMetaDataForm from './components/editor/ChapterMetaDataForm';
import ChapterEditor from './components/chapters/ChapterEditor';
import GearItemReview from './components/GearItemReview/GearItemReview';

const NO_FOOTER_SCREENS = [
  'Chapter',
  'ImageCaptionForm',
  'ManageContent',
  'RouteEditor',
  'RouteViewer',
  'JournalRoute',
  'JournalForm',
  'CountriesEditor',
  'ChapterEditor',
  'ChapterMetaDataForm',
  'StravaRouteSelector'
];

const JournalFeedNavigator = createStackNavigator(
  {
    JournalFeed,
    Journal,
    Chapter: ChapterDispatch,
    ChapterMetaDataForm,
    CommentForm,
    ImageCaptionForm,
    ManageContent,
    JournalForm,
    CountriesEditor,
    RouteEditor,
    RouteViewer,
    JournalRoute,
    ChapterEditor,
    StravaRouteSelector,
    GearItemReview
  },
  {
    initialRouteName: 'JournalFeed',
    headerMode: 'none',
    navigationOptions: {
      headerTransparent: true,
      headerStyle: {
        borderBottomWidth: 0
      }
    }
  }
);

const ProfileNavigator = createStackNavigator(
  {
    Profile: {
      screen: Profile,
      path: '/profile'
    },
    Journal,
    Chapter: ChapterDispatch,
    ChapterMetaDataForm,
    CommentForm,
    ImageCaptionForm,
    JournalForm,
    CountriesEditor,
    RouteEditor,
    RouteViewer,
    JournalRoute,
    ManageContent,
    ChapterEditor,
    StravaRouteSelector,
    GearItemReview
  },
  {
    initialRouteName: 'Profile',
    headerMode: 'none',
    headerTransparent: true,
    headerStyle: {
      borderBottomWidth: 0
    }
  }
);

const AuthFlow = createStackNavigator(
  {
    HomeLoggedOut
  },
  {
    initialRouteName: 'HomeLoggedOut',
    headerMode: 'none',
    headerTransparent: true,
    headerStyle: {
      borderBottomWidth: 0
    }
  }
);

JournalFeedNavigator.navigationOptions = ({ navigation }) => {
  const { routeName } = navigation.state.routes[navigation.state.index];
  const navigationOptions = {};
  if (NO_FOOTER_SCREENS.includes(routeName)) {
    navigationOptions.tabBarVisible = false;
  }
  return navigationOptions;
};

AuthFlow.navigationOptions = ({ navigation }) => {
  const { routeName } = navigation.state.routes[navigation.state.index];
  const navigationOptions = {};
  if (NO_FOOTER_SCREENS.includes(routeName)) {
    navigationOptions.tabBarVisible = false;
  }
  return navigationOptions;
};

ProfileNavigator.navigationOptions = ({ navigation }) => {
  const { routeName } = navigation.state.routes[navigation.state.index];
  const navigationOptions = {};
  if (NO_FOOTER_SCREENS.includes(routeName)) {
    navigationOptions.tabBarVisible = false;
  }
  return navigationOptions;
};

export const RootNavigator = (signedIn = false) =>
  createSwitchNavigator(
    {
      AuthFlow,
      BottomNavigator: {
        screen: BottomNavigator,
        path: 'bottomnavigator'
      }
    },
    {
      initialRouteName: signedIn ? 'BottomNavigator' : 'AuthFlow',
      path: 'ventur'
    }
  );

const BottomNavigator = createBottomTabNavigator(
  {
    Explore: JournalFeedNavigator,
    Profile: {
      screen: ProfileNavigator,
      path: 'profile'
    }
  },
  {
    initialRouteName: 'Profile',
    tabBarComponent: BottomTabBar
  }
);
