import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableHighlight,
  TouchableWithoutFeedback
} from 'react-native';
import ChapterList from '../chapters/ChapterList';
import ChapterMetaDataForm from '../editor/ChapterMetaDataForm';
import {
  loadSingleJournal,
  requestForChapter,
  resetJournalShow,
  uploadBannerImage,
  imageUploading,
  updateTabIndex,
  toggleJournalFollow
} from '../../actions/journals';
import { Feather } from '@expo/vector-icons';
import { populateGearItemReview } from '../../actions/gear_item_review';
import {
  toggleCameraRollModal,
  updateActiveView
} from '../../actions/camera_roll';
import { MaterialIndicator } from 'react-native-indicators';
import {
  updateJournalForm,
  toggleJournalFormModal
} from '../../actions/journal_form';
import { resetChapter } from '../../actions/chapter';
import { triggerGearReviewFormFromJournal } from '../../actions/gear_review_form';
import { loadJournalMap } from '../../actions/journal_route';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { SimpleLineIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
  updateChapterForm,
  toggleChapterModal
} from '../../actions/chapter_form';
import ThreeDotDropdown from '../shared/ThreeDotDropdown';
import LoadingScreen from '../shared/LoadingScreen';
import ProgressiveImage from '../shared/ProgressiveImage';
import GearListItem from '../GearItem/GearListItem';
import { FloatingAction } from 'react-native-floating-action';
import ImagePickerContainer from '../shared/ImagePickerContainer';
import JournalForm from '../JournalForm/JournalForm';
import GearReviewForm from '../GearReviewForm/GearReviewForm';
import { journalBackground } from '../../assets/images/stockPhotos.js';

const mapStateToProps = state => ({
  journal: state.journal.journal,
  imageUploading: state.journal.imageUploading,
  user: state.journal.journal.user,
  chapters: state.journal.journal.chapters,
  chapterForm: state.chapterForm,
  loaded: state.journal.loaded,
  currentUser: state.common.currentUser,
  width: state.common.width,
  height: state.common.height,
  subContentLoading: state.journal.subContentLoading,
  index: state.journal.tabIndex,
  routes: state.journal.routes,
  activeView: state.cameraRoll.activeView
});

const mapDispatchToProps = dispatch => ({
  updateChapterForm: payload => dispatch(updateChapterForm(payload)),
  toggleJournalFollow: () => dispatch(toggleJournalFollow()),
  updateJournalForm: payload => dispatch(updateJournalForm(payload)),
  toggleCameraRollModal: payload => dispatch(toggleCameraRollModal(payload)),
  toggleJournalFormModal: payload => dispatch(toggleJournalFormModal(payload)),
  requestForChapter: payload => dispatch(requestForChapter(payload)),
  loadSingleJournal: payload => dispatch(loadSingleJournal(payload)),
  triggerGearReviewFormFromJournal: payload =>
    dispatch(triggerGearReviewFormFromJournal(payload)),
  resetChapter: () => dispatch(resetChapter()),
  updateImageUploading: bool => dispatch(imageUploading(bool)),
  loadJournalMap: id => dispatch(loadJournalMap(id)),
  resetJournalShow: () => dispatch(resetJournalShow()),
  uploadBannerImage: (journalId, img) =>
    dispatch(uploadBannerImage(journalId, img)),
  updateTabIndex: payload => dispatch(updateTabIndex(payload)),
  toggleChapterModal: payload => dispatch(toggleChapterModal(payload)),
  updateActiveView: payload => dispatch(updateActiveView(payload)),
  populateGearItemReview: payload => dispatch(populateGearItemReview(payload))
});

class Journal extends Component {
  constructor(props) {
    super(props);
  }

  static actions = [
    {
      text: 'New Chapter',
      icon: <MaterialIcons name={'edit'} color="white" size={20} />,
      name: 'create_chapter',
      position: 0,
      color: '#3F88C5'
    },
    {
      text: 'New Gear Item',
      icon: <MaterialIcons name={'directions-bike'} color="white" size={20} />,
      name: 'create_gear_item',
      position: 1,
      color: '#3F88C5'
    }
  ];

  componentWillMount() {
    this.requestForJournal();
  }

  requestForJournal() {
    let journalId = this.props.navigation.getParam('journalId', 'NO-ID');

    if (journalId === 'NO-ID') return;
    this.props.loadSingleJournal(journalId);
  }

  requestForChapter = chapterId => {
    this.props.resetChapter();
    this.props.navigation.navigate('Chapter');
    this.props.requestForChapter(chapterId);
  };

  navigateBack = () => {
    this.props.navigation.goBack();
    setTimeout(this.props.resetJournalShow, 300);
  };

  navigateToMap = () => {
    this.props.navigation.navigate('JournalRoute');
    this.props.loadJournalMap(this.props.journal.id);
  };

  getJournalOptions() {
    let optionsProps = [
      {
        title: 'Edit Journal',
        callback: this.renderJournalEditForm
      },
      {
        title: 'Upload Image',
        callback: this.updateBannerImage
      }
    ];

    return optionsProps;
  }

  uploadImage = img => {
    this.props.updateImageUploading(true);
    let imgPost = Object.assign(
      {},
      {
        uri: img.uri,
        name: img.filename,
        type: 'multipart/form-data'
      }
    );

    this.props.uploadBannerImage(this.props.journal.id, imgPost);
  };

  handleFollowCtaPress = () => {
    this.props.toggleJournalFollow();
  };

  renderFollowingCta(isFollowing) {
    if (this.isCurrentUsersJournal()) {
      return <Text />;
    }
    const cta = isFollowing ? 'UNFOLLOW' : 'FOLLOW';

    return (
      <TouchableWithoutFeedback onPress={this.handleFollowCtaPress}>
        <View>
          <Text style={styles.followCta}>
            {' '}
            {`\u2022`} {cta}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  updateBannerImage = () => {
    this.props.updateActiveView('journal');
    this.props.toggleCameraRollModal(true);
  };

  returnDistanceString(distance) {
    const {
      distanceType,
      kilometerAmount,
      mileAmount,
      readableDistanceType
    } = distance;
    switch (distanceType) {
      case 'kilometer':
        return `${kilometerAmount} ${readableDistanceType}`;

      case 'mile':
        return `${mileAmount} ${readableDistanceType}`;

      default:
        return '';
    }
  }

  renderJournalEditForm = () => {
    const {
      id,
      title,
      description,
      status,
      countries,
      distance: { distanceType }
    } = this.props.journal;

    const payload = Object.assign(
      {},
      {
        id,
        title,
        description,
        status,
        distanceType,
        includedCountries: countries
      }
    );

    this.props.updateJournalForm(payload);
    this.props.toggleJournalFormModal(true);
  };

  renderCountries() {
    let name;
    const { countries } = this.props.journal;
    return countries.map((country, index) => {
      name =
        index === countries.length - 1 ? country.name : `${country.name}, `;
      return (
        <Text key={country.name} style={styles.journalDescription}>
          {name}
        </Text>
      );
    });
  }

  renderThreeDotMenu(user) {
    if (user.id == this.props.currentUser.id) {
      const options = this.getJournalOptions();
      return <ThreeDotDropdown options={options} />;
    } else {
      return (
        <Image style={styles.userImage} source={{ uri: user.avatarImageUrl }} />
      );
    }
  }

  renderNavHeader(user) {
    return (
      <View style={styles.navigationContainer}>
        <TouchableHighlight
          underlayColor="rgba(111, 111, 111, 0.5)"
          style={styles.backButton}
          onPress={this.navigateBack}
        >
          <Ionicons
            style={styles.backIconPosition}
            name="ios-arrow-back"
            size={28}
            color="white"
          />
        </TouchableHighlight>
        {this.renderThreeDotMenu(user)}
      </View>
    );
  }

  renderImageUploadingScreen() {
    if (!this.props.imageUploading) return;

    return (
      <View style={[styles.imageUploadingScreen, { width: this.props.width }]}>
        <MaterialIndicator size={40} color="#FF5423" />
      </View>
    );
  }

  renderBannerAndUserImages(journal, user) {
    const cardBannerImageUrl =
      journal.cardBannerImageUrl.length > 0
        ? journal.cardBannerImageUrl
        : journalBackground;

    return (
      <View style={[styles.bannerUserImage]}>
        <ProgressiveImage
          source={cardBannerImageUrl}
          thumbnailSource={journal.thumbnailSource}
          style={[styles.bannerAndUser, { width: this.props.width }]}
        />
        <View style={[styles.banner, { width: this.props.width }]}>
          {this.renderImageUploadingScreen()}
          {this.renderNavHeader(user)}
          {this.renderJournalMetadata(journal)}
        </View>
      </View>
    );
  }

  renderLocation() {
    if (this.props.journal.countries.length === 0) return;

    return (
      <View style={styles.locationContainer}>
        <SimpleLineIcons
          name="location-pin"
          style={styles.iconPosition}
          size={14}
          color="white"
        />
        <Text numberOfLines={1}>{this.renderCountries()}</Text>
      </View>
    );
  }

  renderJournalMetadata(journal) {
    const distance = this.returnDistanceString(journal.distance);
    const followingCta = this.renderFollowingCta(journal.isFollowing);

    return (
      <View style={styles.metaDataContainer}>
        <View style={styles.titleSubTitleContainer}>
          {this.renderLocation()}
          <Text style={styles.journalHeader}>{journal.title}</Text>
        </View>
        <View style={styles.statsAndMapContainer}>
          <View>
            <View>
              <Text style={styles.stats}>
                {`${journal.status.replace(
                  '_',
                  ' '
                )} \u2022 ${distance}`.toUpperCase()}
              </Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <Text style={styles.stats}>
                FOLLOWERS: {this.props.journal.journalFollowsCount}
              </Text>
              {followingCta}
            </View>
          </View>
          <View>
            <TouchableWithoutFeedback onPress={this.navigateToMap}>
              <View style={styles.mapPadding}>
                <Feather name="map" size={20} color="white" />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
  }

  renderHeader() {
    const { journal, user } = this.props;
    return <View>{this.renderBannerAndUserImages(journal, user)}</View>;
  }

  renderJournalEmptyState(isChapter = false) {
    const ctaText = isChapter ? 'No chapters yet' : 'No gear reviews yet';
    const { width, height } = this.props;
    const halfHeight = height / 2;
    const thirdWidth = width / 3;
    const fifthWidth = width / 5;

    return (
      <View
        key={'chapterEmptyState'}
        style={[styles.childEmptyState, { width: width, height: halfHeight }]}
      >
        <View style={styles.flexAndDirection}>
          <View>
            <View style={styles.emptyStateCtaContainer}>
              <Text style={styles.ctaText}>{ctaText}</Text>
            </View>
            <View style={[styles.emptyBar, { width: thirdWidth }]} />
            <View style={[styles.emptyBar, { width: fifthWidth }]} />
            <View style={[styles.emptyBar, { width: fifthWidth }]} />
          </View>
          <View style={styles.emptyImage} />
        </View>
      </View>
    );
  }

  renderSubContentLoading = () => {
    return (
      <MaterialIndicator
        key={'chapterLoading'}
        style={styles.marginTop50}
        size={40}
        color="#FF5423"
      />
    );
  };

  renderChapters() {
    if (this.props.chapters.length === 0) {
      return this.renderJournalEmptyState(true);
    }

    return (
      <View
        key={'chapterList'}
        style={[styles.marginBottom100, { width: this.props.width }]}
      >
        <ChapterList
          chapters={this.props.chapters}
          user={this.props.journal.user}
          currentUser={this.props.currentUser}
          handleSelectChapter={this.requestForChapter}
        />
      </View>
    );
  }

  isCurrentUsersJournal() {
    return this.props.user.id == this.props.currentUser.id;
  }

  handleGearItemPress = id => {
    const payload = Object.assign({}, { id, loading: true });

    this.props.populateGearItemReview(payload);
    this.props.navigation.navigate('GearItemReview');
  };

  navigateToGearReviewForm = () => {
    this.props.triggerGearReviewFormFromJournal(this.props.journal.id);
  };

  navigateToForm = name => {
    switch (name) {
      case 'create_chapter':
        return this.navigateToChapterForm();
      case 'create_gear_item':
        return this.navigateToGearReviewForm();
      default:
        return null;
    }
  };

  navigateToChapterForm = () => {
    let chapterForm = Object.assign(
      {},
      {
        id: null,
        title: '',
        date: new Date(),
        distance: 0,
        readableDistanceType: this.props.journal.distance.readableDistanceType,
        journalId: this.props.journal.id,
        bannerImage: { uri: '' }
      }
    );

    this.props.updateChapterForm(chapterForm);
    this.props.toggleChapterModal(true);
  };

  renderFloatingButton() {
    if (!this.isCurrentUsersJournal()) return;

    return (
      <FloatingAction
        color={'#3F88C5'}
        actions={Journal.actions}
        onPressItem={name => {
          this.navigateToForm(name);
        }}
      />
    );
  }

  renderGear() {
    if (this.props.journal.gear.length === 0) {
      return this.renderJournalEmptyState();
    }

    return (
      <View style={{ height: this.props.height }}>
        {this.props.journal.gear.map((gearItem, index) => {
          return (
            <GearListItem
              gearItem={gearItem}
              gearItemPress={() => this.handleGearItemPress(gearItem.id)}
            />
          );
        })}
      </View>
    );
  }

  updateTabIndex = index => {
    this.props.updateTabIndex(index);
  };

  getTabProps = () => {
    return Object.assign(
      [],
      [
        Object.assign(
          {},
          {
            label: 'CHAPTERS',
            view: this.renderChapters()
          }
        ),
        Object.assign({
          label: 'GEAR',
          view: this.renderGear()
        })
      ]
    );
  };

  getNavigationState() {
    const { index, routes } = this.props;
    return Object.assign({}, { index, routes });
  }

  renderTabView() {
    if (this.props.subContentLoading) {
      return this.renderSubContentLoading();
    }

    return (
      <TabView
        navigationState={this.getNavigationState()}
        renderScene={({ route }) => {
          switch (route.key) {
            case 'chapters':
              return this.renderChapters();
            case 'gear':
              return this.renderGear();
            default:
              return null;
          }
        }}
        onIndexChange={this.updateTabIndex}
        initialLayout={{ width: this.props.width, height: this.props.height }}
        renderTabBar={props => (
          <TabBar
            {...props}
            tabStyle={{ color: '#3F88C5' }}
            activeColor="#3F88C5"
            inactiveColor="#3F88C5"
            indicatorStyle={{ backgroundColor: '#3F88C5' }}
            style={{ backgroundColor: 'white' }}
          />
        )}
      />
    );
  }

  renderImagePickerContainer() {
    if (this.props.activeView !== 'journal') return;

    return (
      <ImagePickerContainer imageCallback={this.uploadImage} selectSingleItem />
    );
  }

  render() {
    if (!this.props.loaded) {
      return <LoadingScreen />;
    }

    return (
      <React.Fragment>
        <View style={styles.containerContainer}>
          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
          >
            {this.renderHeader()}
            {this.renderTabView()}
          </ScrollView>
          {this.renderFloatingButton()}
          <ChapterMetaDataForm navigateToChapter={this.requestForChapter} />
          {this.renderImagePickerContainer()}
          <JournalForm />
          <GearReviewForm />
        </View>
        <SafeAreaView style={styles.backgroundWhite} />
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  containerContainer: {
    height: '100%',
    position: 'relative'
  },
  backgroundWhite: {
    backgroundColor: 'white'
  },
  container: {
    backgroundColor: 'white'
  },
  bannerAndUser: {
    height: 220,
    zIndex: 0
  },
  childEmptyState: {
    marginTop: 10,
    paddingRight: 20,
    paddingLeft: 20
  },
  imageUploadingScreen: {
    position: 'absolute',
    height: '100%'
  },
  mapPadding: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10
  },
  emptyBar: {
    marginBottom: 5,
    height: 15,
    backgroundColor: 'lightgray'
  },
  navigationContainer: {
    marginTop: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    zIndex: 10
  },
  emptyStateCtaContainer: {
    marginBottom: 10
  },
  ctaText: {
    fontSize: 20,
    color: 'gray'
  },
  backButton: {
    padding: 20,
    height: 50,
    width: 50,
    marginLeft: 10,
    borderRadius: 25,
    position: 'relative'
  },
  emptyImage: {
    width: 80,
    height: 100,
    backgroundColor: 'lightgray',
    borderRadius: 4
  },
  metaDataContainer: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 10,
    marginTop: 'auto'
  },
  statsAndMapContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10
  },
  journalHeader: {
    fontSize: 26,
    fontFamily: 'playfair',
    color: 'white'
  },
  journalDescription: {
    fontSize: 14,
    fontFamily: 'open-sans-regular',
    color: 'white',
    marginRight: 5
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20,
    borderWidth: 2,
    borderColor: 'white'
  },
  stats: {
    fontFamily: 'overpass',
    color: 'white'
  },
  backIconPosition: {
    position: 'absolute',
    top: 11,
    left: 18
  },
  banner: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  flexAndDirection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  bannerUserImage: {
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'white'
  },
  marginTop50: {
    marginTop: 50
  },
  marginBottom100: {
    marginBottom: 100
  },
  locationContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  followCta: {
    color: 'white',
    fontFamily: 'overpass'
  },
  iconPosition: { marginRight: 5 }
});

export default connect(mapStateToProps, mapDispatchToProps)(Journal);
