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
import ChapterList from "components/chapters/ChapterList"
import { get } from "agent"
import { loadSingleJournal } from "actions/journals"
import { createChapter } from "utils/chapter_form_helper"
import { updateJournalForm } from "actions/journal_form"
import { loadChapter } from "actions/chapter"
import { connect } from "react-redux"
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons"
import { updateChapterForm, addChapterToJournals } from "actions/chapter_form"

const mapStateToProps = state => ({
  journal: state.journal.journal,
  user: state.journal.journal.user,
  chapters: state.journal.journal.chapters,
  chapterForm: state.chapterForm,
  loaded: state.journal.loaded,
  currentUser: state.common.currentUser,
  width: state.common.width,
  height: state.common.height
})

const mapDispatchToProps = dispatch => ({
  loadChapter: payload => dispatch(loadChapter(payload)),
  updateChapterForm: payload => dispatch(updateChapterForm(payload)),
  updateJournalForm: payload => dispatch(updateJournalForm(payload)),
  addChapterToJournals: payload => dispatch(addChapterToJournals(payload)),
  loadSingleJournal: payload => dispatch(loadSingleJournal(payload))
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
    get(`/chapters/${chapterId}`).then(data => {
      this.props.loadChapter(data.chapter)
      this.props.navigation.navigate("Chapter")
    })
  }

  navigateBack = () => {
    this.props.navigation.goBack()
  }

  getBannerHeight() {
    let { height, width } = this.props

    if (width > height) {
      return this.props.height / 2
    } else {
      return this.props.height / 4
    }
  }

  renderJournalEditForm = () => {
    const { id, title, description, status } = this.props.journal
    let obj = {
      id: id,
      title: title,
      description: description,
      status: status
    }

    this.props.updateJournalForm(obj)
    this.props.navigation.navigate("JournalFormTitle")
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

  renderNavHeader(user) {
    return (
      <View style={styles.navigationContainer}>
        <TouchableHighlight
          underlayColor="rgba(111, 111, 111, 0.5)"
          style={styles.backButton}
          onPress={this.navigateBack}>
          <Ionicons style={styles.backIconPosition} name="ios-arrow-back" size={28} color="white" />
        </TouchableHighlight>
        {this.renderImageOrEdit(user)}
      </View>
    )
  }

  renderBannerAndUserImages(journal, user) {
    let bannerHeight = this.getBannerHeight()
    return (
      <View style={[styles.bannerUserImage, { height: bannerHeight }]}>
        <ImageBackground
          style={{ height: bannerHeight, width: this.props.width }}
          source={{ uri: journal.cardBannerImageUrl }}>
          <View style={[styles.banner, { width: this.props.width, height: bannerHeight }]}>
            {this.renderNavHeader(user)}
            {this.renderJournalMetadata(journal)}
          </View>
        </ImageBackground>
      </View>
    )
  }

  renderJournalMetadata(journal) {
    return (
      <View style={styles.metaDataContainer}>
        <View style={styles.titleSubTitleContainer}>
          <View style={styles.locationContainer}>
            <SimpleLineIcons name="location-pin" style={styles.iconPosition} size={14} color="white" />
            <Text style={styles.journalDescription}>{journal.description}</Text>
          </View>
          <Text style={styles.journalHeader}>{journal.title}</Text>
        </View>
        <View>
          <Text style={styles.stats}>{`${journal.status} \u2022 ${journal.distance} kilometers`.toUpperCase()}</Text>
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

  renderChapters() {
    if (this.props.chapters.length === 0) {
      return this.renderEmptyChapterState()
    }

    return (
      <View style={{ marginBottom: 100 }}>
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

  mungeForChapterForm(data) {
    return Object.assign(
      {},
      {
        id: data.id,
        title: data.title,
        date: data.date,
        offline: data.offline,
        distance: data.distance,
        journalId: data.journal.id,
        bannerImage: { uri: "" }
      }
    )
  }

  chapterCreateCallback = data => {
    let chapterFormData = this.mungeForChapterForm(data)
    this.props.updateChapterForm(chapterFormData)
    this.props.addChapterToJournals(data)
    this.props.loadChapter(data)
    this.props.navigation.navigate("Chapter", { initialChapterForm: true })
  }

  navigateToChapterForm = () => {
    let obj = {
      id: null,
      title: "",
      date: new Date(),
      offline: false,
      distance: 0,
      journalId: this.props.journal.id,
      bannerImage: { uri: "" }
    }
    createChapter(obj, this.chapterCreateCallback)
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
            backgroundColor: "#067BC2",
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

  render() {
    if (!this.props.loaded) return null
    return (
      <View style={{ height: "100%", position: "relative" }}>
        <ScrollView style={styles.container}>
          {this.renderHeader()}
          {this.renderChapters()}
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
    alignItems: "center"
  },
  backButton: {
    padding: 20,
    height: 50,
    width: 50,
    marginLeft: 10,
    borderRadius: "50%",
    position: "relative"
  },
  metaDataContainer: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 10,
    marginTop: "auto"
  },
  journalHeader: {
    fontSize: 28,
    fontFamily: "playfair",
    color: "white"
  },
  journalDescription: {
    fontSize: 14,
    fontFamily: "open-sans-regular",
    color: "white"
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
    position: "relative",
    backgroundColor: "white"
  },
  locationContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  iconPosition: { marginRight: 5 }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Journal)
