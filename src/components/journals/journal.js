import React, { Component } from "react"
import { Feather } from "@expo/vector-icons"
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  ImageBackground,
  TouchableHighlight,
  Dimensions,
  TouchableWithoutFeedback
} from "react-native"
import ChapterList from "../chapters/ChapterList"
import { get } from "../../agent"
import {
  loadSingleJournal,
  requestForChapter,
  resetJournalShow,
  uploadBannerImage,
  imageUploading
} from "../../actions/journals"
import { MaterialIndicator } from "react-native-indicators"
import { createChapter } from "../../utils/chapter_form_helper"
import { updateJournalForm } from "../../actions/journal_form"
import { loadChapter, resetChapter } from "../../actions/chapter"
import { setLoadingTrue, setLoadingFalse } from "../../actions/common"
import { loadJournalMap } from "../../actions/journal_route"
import { connect } from "react-redux"
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons"
import { updateChapterForm, addChapterToJournals } from "../../actions/chapter_form"
import ThreeDotDropdown from "../shared/ThreeDotDropdown"
import LoadingScreen from "../shared/LoadingScreen"
import ProgressiveImage from "../shared/ProgressiveImage"
import GearListItem from "../GearItem/GearListItem"

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
  subContentLoading: state.journal.subContentLoading
})

const mapDispatchToProps = dispatch => ({
  loadChapter: payload => dispatch(loadChapter(payload)),
  updateChapterForm: payload => dispatch(updateChapterForm(payload)),
  updateJournalForm: payload => dispatch(updateJournalForm(payload)),
  addChapterToJournals: payload => dispatch(addChapterToJournals(payload)),
  requestForChapter: payload => dispatch(requestForChapter(payload)),
  loadSingleJournal: payload => dispatch(loadSingleJournal(payload)),
  resetChapter: () => dispatch(resetChapter()),
  setLoadingTrue: () => dispatch(setLoadingTrue()),
  updateImageUploading: bool => dispatch(imageUploading(bool)),
  setLoadingFalse: () => dispatch(setLoadingFalse()),
  loadJournalMap: id => dispatch(loadJournalMap(id)),
  resetJournalShow: () => dispatch(resetJournalShow()),
  uploadBannerImage: (journalId, img) => dispatch(uploadBannerImage(journalId, img))
})

class Journal extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    Expo.ScreenOrientation.allow("ALL")
    this.requestForJournal()
  }

  requestForJournal() {
    let journalId = this.props.navigation.getParam("journalId", "NO-ID")

    if (journalId === "NO-ID") return
    this.props.loadSingleJournal(journalId)
  }

  requestForChapter = chapterId => {
    this.props.resetChapter()
    this.props.navigation.navigate("Chapter")
    this.props.requestForChapter(chapterId)
  }

  navigateBack = () => {
    this.props.navigation.goBack()
    setTimeout(this.props.resetJournalShow, 300)
  }

  getBannerHeight() {
    let { height, width } = this.props

    if (width > height) {
      return this.props.height / 2
    } else {
      return this.props.height / 4
    }
  }

  navigateToMap = () => {
    this.props.navigation.navigate("JournalRoute")
    this.props.loadJournalMap(this.props.journal.id)
  }

  getJournalOptions() {
    let optionsProps = [
      {
        type: "touchable",
        iconName: "edit",
        title: "Edit Journal",
        callback: this.renderJournalEditForm,
        closeMenuOnClick: true
      },
      {
        type: "touchable",
        iconName: "cloud-upload",
        title: "Upload Image",
        callback: this.updateBannerImage,
        closeMenuOnClick: true
      }
    ]

    return optionsProps
  }

  uploadImage(img) {
    this.props.updateImageUploading(true)
    let imgPost = Object.assign(
      {},
      {
        uri: img.uri,
        name: img.filename,
        type: "multipart/form-data"
      }
    )

    this.props.uploadBannerImage(this.props.journal.id, imgPost)
  }

  updateBannerImage = () => {
    this.props.navigation.navigate("CameraRollContainer", {
      selectSingleItem: true,
      singleItemCallback: img => this.uploadImage(img)
    })
  }

  returnDistanceString(distance) {
    const { distanceType, kilometerAmount, mileAmount, readableDistanceType } = distance
    switch (distanceType) {
      case "kilometer":
        return `${kilometerAmount} ${readableDistanceType}`

      case "mile":
        return `${mileAmount} ${readableDistanceType}`

      default:
        return ""
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
    } = this.props.journal

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
    )

    this.props.updateJournalForm(payload)
    this.props.navigation.navigate("JournalForm")
  }

  renderCountries() {
    return this.props.journal.countries.map((country, index) => {
      return <Text style={styles.journalDescription}>{country.name}</Text>
    })
  }

  renderImageOrEdit(user) {
    if (user.id == this.props.currentUser.id) {
      return (
        <TouchableHighlight onPress={this.renderJournalEditForm}>
          <View style={{ padding: 20 }}>
            <Text style={{ color: "white" }}>EDIT</Text>
          </View>
        </TouchableHighlight>
      )
    } else {
      return <Image style={styles.userImage} source={{ uri: user.avatarImageUrl }} />
    }
  }

  renderThreeDotMenu(user) {
    let options
    if (user.id == this.props.currentUser.id) {
      options = this.getJournalOptions()
      return <ThreeDotDropdown options={options} menuOpenStyling={Object.assign({})} menuPosition={"below"} />
    } else {
      return <Image style={styles.userImage} source={{ uri: user.avatarImageUrl }} />
    }
  }

  renderNavHeader(user) {
    return (
      <View style={styles.navigationContainer}>
        <TouchableHighlight
          underlayColor="rgba(111, 111, 111, 0.5)"
          style={styles.backButton}
          onPress={this.navigateBack}>
          <Ionicons style={styles.backIconPosition} name="ios-arrow-back" size={28} color="white" />
        </TouchableHighlight>
        {this.renderThreeDotMenu(user)}
      </View>
    )
  }

  renderImageUploadingScreen() {
    if (!this.props.imageUploading) return

    return (
      <View style={{ position: "absolute", width: this.props.width, height: "100%" }}>
        <MaterialIndicator size={40} color="#FF5423" />
      </View>
    )
  }

  renderBannerAndUserImages(journal, user) {
    return (
      <View style={[styles.bannerUserImage]}>
        <ProgressiveImage
          source={journal.cardBannerImageUrl}
          thumbnailSource={journal.thumbnailSource}
          style={{ width: this.props.width, height: 220, zIndex: 0 }}
        />
        <View style={[styles.banner, { width: this.props.width }]}>
          {this.renderImageUploadingScreen()}
          {this.renderNavHeader(user)}
          {this.renderJournalMetadata(journal)}
        </View>
      </View>
    )
  }

  renderJournalMetadata(journal) {
    const distance = this.returnDistanceString(journal.distance)
    return (
      <View style={styles.metaDataContainer}>
        <View style={styles.titleSubTitleContainer}>
          <View style={styles.locationContainer}>
            <SimpleLineIcons name="location-pin" style={styles.iconPosition} size={14} color="white" />
            {this.renderCountries()}
          </View>
          <Text style={styles.journalHeader}>{journal.title}</Text>
        </View>
        <View style={styles.statsAndMapContainer}>
          <View>
            <View>
              <Text style={styles.stats}>{`${journal.status} \u2022 ${distance}`.toUpperCase()}</Text>
            </View>
            <View>
              <Text style={styles.stats}>FOLLOWERS: {this.props.journal.journalFollowsCount}</Text>
            </View>
          </View>
          <View>
            <TouchableWithoutFeedback onPress={this.navigateToMap}>
              <View>
                <Feather name="map" size={20} color="white" />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    )
  }

  renderHeader() {
    const { journal, user } = this.props
    return <View>{this.renderBannerAndUserImages(journal, user)}</View>
  }

  renderEmptyChapterState() {
    return (
      <View style={{ marginTop: 10, width: this.props.width, paddingRight: 20, paddingLeft: 20 }}>
        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 20, color: "gray" }}>No chapters yet</Text>
            </View>
            <View
              style={{
                width: Dimensions.get("window").width / 3,
                marginBottom: 5,
                height: 15,
                backgroundColor: "lightgray"
              }}
            />
            <View
              style={{
                width: Dimensions.get("window").width / 5,
                marginBottom: 5,
                height: 15,
                backgroundColor: "lightgray"
              }}
            />
            <View
              style={{
                width: Dimensions.get("window").width / 5,
                marginBottom: 5,
                height: 15,
                backgroundColor: "lightgray"
              }}
            />
          </View>
          <View style={{ width: 80, height: 100, backgroundColor: "lightgray", borderRadius: 4 }} />
        </View>
      </View>
    )
  }

  renderChapterLoadingIcon = () => {
    return <MaterialIndicator style={{marginTop: 50}} size={40} color="#FF5423" />
  }

  renderChapters() {
    if (this.props.subContentLoading) {
      return this.renderChapterLoadingIcon()
    }

    if (this.props.chapters.length === 0) {
      return this.renderEmptyChapterState()
    }

    return (
      <View style={{ marginBottom: 100, width: this.props.width }}>
        <ChapterList
          chapters={this.props.chapters}
          user={this.props.journal.user}
          currentUser={this.props.currentUser}
          handleSelectChapter={this.requestForChapter}
        />
      </View>
    )
  }

  isCurrentUsersJournal() {
    return this.props.user.id == this.props.currentUser.id
  }

  handleGearItemPress = (id) => {
    console.log("ID", id)
  }

  navigateToChapterForm = () => {
    let chapterForm = Object.assign(
      {},
      {
        id: null,
        title: "",
        date: new Date(),
        distance: 0,
        readableDistanceType: this.props.journal.distance.readableDistanceType,
        journalId: this.props.journal.id,
        bannerImage: { uri: "" }
      }
    )

    this.props.updateChapterForm(chapterForm)
    this.props.navigation.navigate("ChapterMetaDataForm")
  }

  renderCreateChapterCta() {
    if (!this.isCurrentUsersJournal()) return
    return (
      <TouchableWithoutFeedback onPress={this.navigateToChapterForm}>
        <View
          shadowColor="gray"
          shadowOffset={{ width: 1, height: 1 }}
          shadowOpacity={0.5}
          shadowRadius={2}
          style={{
            position: "absolute",
            backgroundColor: "#3F88C5",
            width: 60,
            height: 60,
            borderRadius: 30,
            bottom: 20,
            right: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
          <Feather name="plus" size={32} color="white" />
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderGear() {
    return this.props.journal.gear.map((gearItem, index) => {
      console.log("GEAR ITEM", gearItem)
      return <GearListItem gearItem={gearItem} handleGearItemPress={() => this.handleGearItemPress(gearItem.id)} />
    })
  }

  render() {
    if (!this.props.loaded) {
      return <LoadingScreen />
    }

          // {this.renderChapters()}
    return (
      <View style={{ height: "100%", position: "relative" }}>
        <ScrollView style={styles.container}>
          {this.renderHeader()}
          {this.renderGear()}
        </ScrollView>
        {this.renderCreateChapterCta()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white"
  },
  navigationContainer: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    zIndex: 10
  },
  backButton: {
    padding: 20,
    height: 50,
    width: 50,
    marginLeft: 10,
    borderRadius: 25,
    position: "relative"
  },
  metaDataContainer: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 10,
    marginTop: "auto"
  },
  statsAndMapContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10
  },
  journalHeader: {
    fontSize: 26,
    fontFamily: "playfair",
    color: "white"
  },
  journalDescription: {
    fontSize: 14,
    fontFamily: "open-sans-regular",
    color: "white",
    marginRight: 5
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20,
    borderWidth: 2,
    borderColor: "white"
  },
  stats: {
    fontFamily: "overpass",
    color: "white"
  },
  backIconPosition: {
    position: "absolute",
    top: 11,
    left: 18
  },
  banner: {
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  bannerUserImage: {
    overflow: "hidden",
    position: "relative",
    backgroundColor: "white"
  },
  locationContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5
  },
  iconPosition: { marginRight: 5 }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Journal)
