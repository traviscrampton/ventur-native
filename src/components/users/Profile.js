import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  SafeAreaView,
  TouchableWithoutFeedback,
  RefreshControl
} from 'react-native';
import { Linking } from 'expo';
import GearListItem from '../GearItem/GearListItem';
import { MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';
import {
  getProfilePageData,
  uploadProfilePhoto,
  setDefaultAppState,
  toggleIsRefreshing
} from '../../actions/user';
import JournalMini from '../journals/JournalMini';
import JournalForm from '../JournalForm/JournalForm';
import { MaterialIndicator } from 'react-native-indicators';
import { toggleGearReviewFormModal } from '../../actions/gear_review_form';
import { toggleJournalFormModal } from '../../actions/journal_form';
import { resetJournalShow } from '../../actions/journals';
import {
  toggleCameraRollModal,
  updateActiveView
} from '../../actions/camera_roll';
import { setCurrentUser } from '../../actions/common';
import { authenticateStravaUser } from '../../actions/strava';
import ThreeDotDropdown from '../shared/ThreeDotDropdown';
import { populateGearItemReview } from '../../actions/gear_item_review';
import { logOut } from '../../auth';
import { encodeQueryString } from '../../agent';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import LoadingScreen from '../shared/LoadingScreen';
import * as WebBrowser from 'expo-web-browser';
import { FloatingAction } from 'react-native-floating-action';
import GearReviewForm from '../GearReviewForm/GearReviewForm';
import ImagePickerContainer from '../shared/ImagePickerContainer';
import { cycleTouringLogo } from '../../assets/images/stockPhotos';

const mapStateToProps = state => ({
  currentUser: state.common.currentUser,
  stravaAccessToken: state.common.stravaAccessToken,
  stravaClientId: state.common.stravaClientId,
  user: state.user.user,
  profilePhotoLoading: state.user.profilePhotoLoading,
  gear: state.user.user.gear,
  journals: state.user.user.journals,
  width: state.common.width,
  height: state.common.height,
  isLoading: state.user.isLoading,
  activeView: state.cameraRoll.activeView,
  isRefreshing: state.user.isRefreshing
});

const mapDispatchToProps = dispatch => ({
  setCurrentUser: payload => dispatch(setCurrentUser(payload)),
  toggleJournalFormModal: payload => dispatch(toggleJournalFormModal(payload)),
  resetJournalShow: () => dispatch(resetJournalShow()),
  authenticateStravaUser: payload => dispatch(authenticateStravaUser(payload)),
  getProfilePageData: () => dispatch(getProfilePageData()),
  toggleGearReviewFormModal: payload =>
    dispatch(toggleGearReviewFormModal(payload)),
  populateGearItemReview: payload => dispatch(populateGearItemReview(payload)),
  toggleCameraRollModal: payload => dispatch(toggleCameraRollModal(payload)),
  uploadProfilePhoto: payload => dispatch(uploadProfilePhoto(payload)),
  setDefaultAppState: () => dispatch(setDefaultAppState()),
  updateActiveView: payload => dispatch(updateActiveView(payload)),
  toggleIsRefreshing: payload => dispatch(toggleIsRefreshing(payload))
});

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0
    };
  }

  static actions = [
    {
      text: 'New Journal',
      icon: <MaterialIcons name={'edit'} color="white" size={20} />,
      name: 'create_journal',
      position: 0,
      color: '#FF5423'
    },
    {
      text: 'New Gear Item',
      icon: <MaterialIcons name={'directions-bike'} color="white" size={20} />,
      name: 'create_gear_item',
      position: 1,
      color: '#FF5423'
    }
  ];

  componentWillMount() {
    this.props.getProfilePageData();
  }

  handleLogout = async () => {
    await logOut();
    this.props.setCurrentUser(null);
    this.props.setDefaultAppState();
  };

  handleJournalPress = journalId => {
    this.props.navigation.navigate('Journal', { journalId });
  };

  getAvatarImageUrl() {
    return this.props.user.avatarImageUrl
      ? this.props.user.avatarImageUrl
      : cycleTouringLogo;
  }

  handleRefresh = () => {
    this.props.toggleIsRefreshing(true);
    this.props.getProfilePageData();
    this.props.toggleIsRefreshing(false);
  };

  connectToStrava = async () => {
    if (this.props.stravaAccessToken) return;
    const redirect = 'ventur://ventur';
    const params = Object.assign(
      {},
      {
        client_id: this.props.stravaClientId,
        response_type: 'code',
        redirect_uri: redirect,
        scope: 'activity:read_all',
        approval_prompt: 'force'
      }
    );

    let url =
      'https://www.strava.com/oauth/authorize' + encodeQueryString(params);
    const result = await WebBrowser.openAuthSessionAsync(url);
    await this.props.authenticateStravaUser(result);
  };

  stravaCtaText() {
    return this.props.stravaAccessToken
      ? 'Connected to Strava'
      : 'Connect To Strava';
  }

  launchImagePicker = async () => {
    await this.props.updateActiveView('profile');
    this.props.toggleCameraRollModal(true);
  };

  renderUserName() {
    return (
      <View
        style={[styles.userNameContainer, { height: this.props.width / 4 }]}
      >
        <View>
          <Text style={styles.userNameText}>
            Hi {this.props.user.firstName}!
          </Text>
        </View>
        <View>
          <Text style={{ width: this.props.width * 0.68 - 40 }}>
            Welcome to Ventur, here you can create trips and gear reviews
          </Text>
        </View>
      </View>
    );
  }

  renderProfileLoadingScreen(imgDimensions) {
    if (!this.props.profilePhotoLoading) return;

    return (
      <View
        style={{
          width: imgDimensions,
          position: 'absolute',
          height: imgDimensions,
          borderRadius: imgDimensions / 2,
          backgroundColor: 'azure'
        }}
      >
        <MaterialIndicator size={25} color="#FF5423" />
      </View>
    );
  }

  renderProfilePhoto() {
    let imgDimensions = this.props.width / 4;
    const options = this.getOptions();
    const avatarImageUrl = this.getAvatarImageUrl();

    return (
      <View
        style={[
          styles.profileContainer,
          {
            width: this.props.width - 30
          }
        ]}
      >
        <TouchableWithoutFeedback onPress={this.launchImagePicker}>
          <View
            shadowColor="gray"
            shadowOffset={{ width: 0, height: 0 }}
            shadowOpacity={0.5}
            shadowRadius={2}
            style={{
              width: imgDimensions,
              position: 'relative',
              height: imgDimensions,
              borderRadius: imgDimensions / 2,
              marginRight: 10
            }}
          >
            <Image
              style={{
                width: imgDimensions,
                height: imgDimensions,
                borderRadius: imgDimensions / 2,
                marginRight: 10,
                borderWidth: 1,
                borderColor: 'gray'
              }}
              source={{ uri: avatarImageUrl }}
            />
            {this.renderProfileLoadingScreen(imgDimensions)}
          </View>
        </TouchableWithoutFeedback>
        <View>{this.renderUserName()}</View>
        <ThreeDotDropdown options={options} />
      </View>
    );
  }

  getOptions() {
    const options = [
      { title: 'Upload Profile Photo', callback: this.launchImagePicker },
      { title: this.stravaCtaText(), callback: this.connectToStrava },
      { title: 'Log Out', callback: this.handleLogout }
    ];

    return options;
  }

  navigateToGearReviewForm() {
    this.props.toggleGearReviewFormModal(true);
  }

  navigateToForm = name => {
    switch (name) {
      case 'create_journal':
        return this.navigateToJournalForm();
      case 'create_gear_item':
        return this.navigateToGearReviewForm();
      default:
        console.log('what in tarnation');
    }
  };

  chooseEmptyStateIcon(isJournal = true) {
    const sizeAndColor = {
      size: 35,
      color: '#323941',
      style: { marginRight: 10 }
    };
    return isJournal ? (
      <Ionicons name={'ios-journal'} {...sizeAndColor} />
    ) : (
      <Entypo name={'tools'} {...sizeAndColor} />
    );
  }

  renderEmptyState(isJournal = true) {
    const content = isJournal ? 'Journals' : 'Gear Items';
    const icon = this.chooseEmptyStateIcon(isJournal);
    const message = `No ${content} yet, press the action button to get started`;

    return (
      <View
        style={{
          height: this.props.height,
          padding: 20
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
          <Text style={styles.fontSize20}>{message}</Text>
        </View>
      </View>
    );
  }

  renderProfilePhotoAndMetadata() {
    return (
      <View
        style={[
          styles.metadataContainer,
          {
            width: this.props.width - 30
          }
        ]}
      >
        <View style={styles.profileView}>{this.renderProfilePhoto()}</View>
      </View>
    );
  }

  uploadProfilePhoto = img => {
    this.props.uploadProfilePhoto(img);
  };

  handleGearItemPress = id => {
    const payload = Object.assign({}, { id, loading: true });

    this.props.populateGearItemReview(payload);
    this.props.navigation.navigate('GearItemReview');
  };

  renderGearItems() {
    if (this.props.gear.length === 0) {
      return this.renderEmptyState(false);
    }

    return this.props.gear.map((gearItem, index) => {
      return (
        <GearListItem
          key={gearItem.id}
          gearItem={gearItem}
          gearItemPress={() => this.handleGearItemPress(gearItem.id)}
        />
      );
    });
  }

  renderGear() {
    return (
      <View style={{ minHeight: this.props.height }}>
        {this.renderGearItems()}
      </View>
    );
  }

  renderProfileJournals() {
    if (this.props.journals.length === 0) {
      return this.renderEmptyState();
    }

    return (
      <View style={styles.relativeWhite}>
        <FlatList
          scrollEnabled={true}
          contentContainerStyle={styles.contentContainerStyle}
          data={this.props.journals}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <JournalMini {...item} handlePress={this.handleJournalPress} />
          )}
        />
      </View>
    );
  }

  navigateToJournalForm = () => {
    this.props.resetJournalShow();
    this.props.toggleJournalFormModal(true);
  };

  renderFloatingCreateButton() {
    return (
      <FloatingAction
        color={'#FF5423'}
        actions={Profile.actions}
        onPressItem={name => {
          this.navigateToForm(name);
        }}
      />
    );
  }

  handleIndexChange = activeIndex => {
    this.setState({ activeIndex });
  };

  getNavigationState = () => {
    return Object.assign(
      {},
      {
        index: this.state.activeIndex,
        routes: [
          { key: 'journals', title: 'Journals' },
          { key: 'gear', title: 'Gear' }
        ]
      }
    );
  };

  renderSlidingTabs() {
    return (
      <TabView
        navigationState={this.getNavigationState()}
        renderScene={({ route }) => {
          switch (route.key) {
            case 'journals':
              return this.renderProfileJournals();
            case 'gear':
              return this.renderGear();
            default:
              return null;
          }
        }}
        onIndexChange={this.handleIndexChange}
        initialLayout={{
          width: this.props.width,
          minHeight: this.props.height
        }}
        renderTabBar={props => (
          <TabBar
            {...props}
            tabStyle={{ color: '#FF5423' }}
            activeColor="#FF5423"
            inactiveColor="#FF5423"
            indicatorStyle={{ backgroundColor: '#FF5423' }}
            style={{ backgroundColor: 'white' }}
          />
        )}
      />
    );
  }

  renderImagePicker() {
    if (this.props.activeView !== 'profile') return;

    return (
      <ImagePickerContainer
        imageCallback={this.uploadProfilePhoto}
        selectSingleItem
      />
    );
  }

  render() {
    if (this.props.isLoading) {
      return <LoadingScreen />;
    }

    return (
      <SafeAreaView style={styles.flexWhite}>
        <View style={styles.white100}>
          <ScrollView>
            <RefreshControl
              refreshing={this.props.isRefreshing}
              onRefresh={this.handleRefresh}
            />
            {this.renderProfilePhotoAndMetadata()}
            <View style={[styles.borderBarrier, { width: this.props.width }]} />
            {this.renderSlidingTabs()}
          </ScrollView>
          {this.renderFloatingCreateButton()}
          {this.renderImagePicker()}
          <JournalForm />
          <GearReviewForm />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  white100: {
    backgroundColor: 'white',
    height: '100%'
  },
  borderBarrier: {
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8'
  },
  flexWhite: {
    flex: 1,
    backgroundColor: 'white'
  },
  userNameContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  userNameText: {
    fontFamily: 'playfair',
    fontSize: 22,
    marginBottom: 5,
    fontWeight: 'bold'
  },
  logoutButton: {
    borderWidth: 1,
    borderRadius: 30,
    borderColor: 'gray',
    paddingTop: 2.5,
    paddingBottom: 2.5,
    paddingLeft: 10,
    paddingRight: 10
  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: 20
  },
  contentContainerStyle: {
    display: 'flex',
    backgroundColor: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    flexWrap: 'wrap'
  },
  relativeWhite: {
    position: 'relative',
    backgroundColor: 'white'
  },
  metadataContainer: {
    padding: 15,
    marginTop: 20,
    backgroundColor: 'white'
  },
  fontSize20: {
    fontSize: 20
  },
  profileView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
