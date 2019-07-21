import React, { Component } from "react"
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  AsyncStorage,
  Dimensions,
  TouchableWithoutFeedback,
  Linking
} from "react-native"
import ChapterList from "../chapters/ChapterList"
import { MaterialIcons, Feather } from "@expo/vector-icons"
import { populateUserPage, populateOfflineChapters } from "../../actions/user"
import JournalMini from "../journals/JournalMini"
import ChapterUserForm from "../chapters/ChapterUserForm"
import { updateChapterForm } from "../../actions/chapter_form"
import { loadChapter } from "../../actions/chapter"
import { loadSingleJournal, resetJournalShow } from "../../actions/journals"
import { setCurrentUser, setLoadingTrue, setLoadingFalse } from "../../actions/common"
import { authenticateStravaUser } from "../../actions/strava"
import { connect } from "react-redux"
import { addJournalsToAsyncStorage } from "../../utils/offline_helpers"
import { logOut } from "../../auth"
import { getChapterFromStorage, updateOfflineChapters } from "../../utils/offline_helpers"
import { setToken, API_ROOT, encodeQueryString, get } from "../../agent"
import LoadingScreen from "../shared/LoadingScreen"
import { WebBrowser } from "expo"
import Expo from "expo"

const mapStateToProps = state => ({
  currentUser: state.common.currentUser,
  stravaClientId: state.common.stravaClientId,
  user: state.user.user,
  offlineChapters: state.user.offlineChapters,
  isLoading: state.common.isLoading
})

const mapDispatchToProps = dispatch => ({
  populateUserPage: payload => dispatch(populateUserPage(payload)),
  populateOfflineChapters: payload => dispatch(populateOfflineChapters(payload)),
  setCurrentUser: payload => dispatch(setCurrentUser(payload)),
  setLoadingTrue: () => dispatch(setLoadingTrue()),
  setLoadingFalse: () => dispatch(setLoadingFalse()),
  loadChapter: payload => dispatch(loadChapter(payload)),
  updateChapterForm: payload => dispatch(updateChapterForm(payload)),
  loadSingleJournal: payload => dispatch(loadSingleJournal(payload)),
  resetJournalShow: () => dispatch(resetJournalShow()),
  authenticateStravaUser: payload => dispatch(authenticateStravaUser(payload))
})

class Profile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeTab: "journals",
      userMenuOpen: false
    }
  }

  componentWillMount() {
    this.props.setLoadingTrue()
    Expo.ScreenOrientation.allow("PORTRAIT_UP")
    this.getProfilePageData()
    this.getOfflineChapters()
  }

  getProfilePageData() {
    get(`/users/${this.props.currentUser.id}`).then(res => {
      const { user } = res
      this.props.populateUserPage(user)
      addJournalsToAsyncStorage(user.journals)
      this.props.setLoadingFalse()
    })
  }

  async getOfflineChapters() {
    let offlineChapters = await AsyncStorage.getItem("chapters")
    offlineChapters = JSON.parse(offlineChapters)
    this.props.populateOfflineChapters(offlineChapters)
  }

  switchActiveTab = newTab => {
    this.setState({
      activeTab: newTab
    })
  }

  isActiveTab(tab) {
    if (this.state.activeTab === tab) {
      return { backgroundColor: "#FF5423", color: "white", borderColor: "#FF5423" }
    }
  }

  handleLogout = async () => {
    await AsyncStorage.setItem("chapters", JSON.stringify([]))
    await AsyncStorage.setItem("journals", JSON.stringify([]))
    await logOut()
    this.props.setCurrentUser(null)
  }

  handleJournalPress = journalId => {
    this.props.navigation.navigate("Journal", { journalId })
  }

  toggleUserMenu = () => {
    let { userMenuOpen } = this.state
    this.setState({
      userMenuOpen: !userMenuOpen
    })
  }

  selectChapter = async chapterId => {
    let chapters = await AsyncStorage.getItem("chapters")
    chapters = JSON.parse(chapters)
    let chapter
    chapter = chapters.find(chapter => {
      return chapter.id === chapterId
    })
    this.props.loadChapter(chapter)
    this.props.navigation.navigate("Chapter")
  }

  populateJournalsAndBeginNavigation = async () => {
    const journals = await AsyncStorage.getItem("journals")
    const obj = { journals: JSON.parse(journals), offline: true }
    this.props.updateChapterForm(obj)
    this.props.navigation.navigate("ChapterFormJournals")
  }

  connectToStrava = async () => {
    if (this.props.currentUser.stravaAccessToken) return

    this.setState({ userMenuOpen: false })
    const redirect = "ventur://venturAuth"
    const params = Object.assign(
      {},
      {
        client_id: this.props.stravaClientId,
        response_type: "code",
        redirect_uri: redirect,
        scope: "activity:read_all",
        approval_prompt: "force"
      }
    )

    let url = "https://www.strava.com/oauth/authorize" + encodeQueryString(params)
    const result = await WebBrowser.openAuthSessionAsync(url)
    await this.props.authenticateStravaUser(result)
  }

  stravaCtaText() {
    return this.props.currentUser.stravaAccessToken ? "Connected to Strava" : "Connect To Strava"
  }

  renderUserName() {
    return (
      <View style={{ height: Dimensions.get("window").width / 4, display: "flex", flexDirection: "column" }}>
        <View>
          <Text style={{ fontFamily: "playfair", fontSize: 22, marginBottom: 5, fontWeight: "bold" }}>
            Hi {this.props.user.firstName}!
          </Text>
        </View>
        <View>
          <Text style={{ width: Dimensions.get("window").width * 0.68 - 30 }}>{this.props.currentUser.linkingUrl}</Text>
        </View>
      </View>
    )
  }

  renderLogOut() {
    return (
      <TouchableWithoutFeedback onPress={this.handleLogout}>
        <View
          style={{
            borderWidth: 1,
            borderRadius: 30,
            borderColor: "gray",
            paddingTop: 2.5,
            paddingBottom: 2.5,
            paddingLeft: 10,
            paddingRight: 10
          }}>
          <Text>Log Out</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderProfilePhoto() {
    let imgDimensions = Dimensions.get("window").width / 4

    return (
      <View
        style={{
          display: "flex",
          width: Dimensions.get("window").width - 30,
          flexDirection: "row",
          alignItems: "top"
        }}>
        <Image
          style={{
            width: imgDimensions,
            height: imgDimensions,
            borderRadius: imgDimensions / 2,
            marginRight: 10,
            borderWidth: 1,
            borderColor: "gray"
          }}
          source={{ uri: this.props.user.avatarImageUrl }}
        />
        <View>{this.renderUserName()}</View>
        <TouchableWithoutFeedback onPress={this.toggleUserMenu}>
          <MaterialIcons name="settings" color="#333" size={24} />
        </TouchableWithoutFeedback>
        {this.renderDropdown()}
      </View>
    )
  }

  renderDropdown() {
    if (!this.state.userMenuOpen) return

    const options = [
      { type: "touchable", title: "Log Out", callback: this.handleLogout },
      { type: "touchable", title: this.stravaCtaText(), callback: this.connectToStrava }
    ]
    return <ChapterUserForm options={options} />
  }

  renderProfilePhotoAndMetadata() {
    return (
      <View
        style={{
          padding: 15,
          marginTop: 20,
          backgroundColor: "white",
          width: Dimensions.get("window").width - 30
        }}>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "top", justifyContent: "space-between" }}>
          {this.renderProfilePhoto()}
        </View>
      </View>
    )
  }

  renderProfileTabBar() {
    return (
      <View
        shadowColor="#d3d3d3"
        shadowOffset={{ width: 0, height: 3 }}
        shadowOpacity={0.3}
        style={{
          marginBottom: 10,
          backgroundColor: "white",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          height: 45
        }}>
        <TouchableWithoutFeedback onPress={() => this.switchActiveTab("journals")}>
          <View
            style={[
              {
                borderColor: "#D1D1D1",
                height: 40,
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: Dimensions.get("window").width / 2.2,
                borderRadius: 30,
                borderWidth: 1,
                marginBottom: 5
              },
              this.isActiveTab("journals")
            ]}>
            <Text style={[{ fontSize: 16 }, this.isActiveTab("journals")]}>
              MY TRIPS ({this.props.user.journals.length})
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => this.switchActiveTab("offlineChapters")}>
          <View
            style={[
              {
                borderColor: "#D1D1D1",
                height: 40,
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: Dimensions.get("window").width / 2.2,
                borderRadius: 30,
                borderWidth: 1,
                marginBottom: 5
              },
              this.isActiveTab("offlineChapters")
            ]}>
            <Text style={[{ fontSize: 16 }, this.isActiveTab("offlineChapters")]}>
              MY CHAPTERS ({this.props.offlineChapters.length})
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderOfflineChapter(chapter, index) {
    return (
      <View>
        <Text>{chapter.title}</Text>
      </View>
    )
  }

  persistOfflineChapter = async chapterId => {
    const offlineChapter = await getChapterFromStorage(chapterId)

    let selectedImage
    const formData = new FormData()
    const token = await setToken()
    const newImages = offlineChapter.content.filter(entry => {
      return entry.type === "image" && entry.id === null
    })
    if (newImages) {
      for (let image of newImages) {
        selectedImage = {
          uri: image.uri,
          name: image.filename,
          type: "multipart/form-data"
        }
        formData.append("files[]", selectedImage)
      }
    }

    if (offlineChapter.bannerImage.uri) {
      formData.append("banner_image", offlineChapter.bannerImage)
    }

    formData.append("title", offlineChapter.title)
    formData.append("status", offlineChapter.status)
    formData.append("journalId", offlineChapter.journalId)
    formData.append("offline", offlineChapter.offline)
    formData.append("date", offlineChapter.date)
    formData.append("distance", offlineChapter.distance)
    formData.append("content", JSON.stringify(offlineChapter.content))

    fetch(`${API_ROOT}/chapters/upload_offline_chapter`, {
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token
      },
      body: formData
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        updateOfflineChapters(data, this.props.populateOfflineChapters, { id: chapterId })
      })
      .catch(err => {
        console.log("error", err)
      })
  }

  renderOfflineChapters() {
    return (
      <View style={{ marginBottom: 100 }}>
        <ChapterList
          chapters={this.props.offlineChapters}
          user={this.props.user}
          currentUser={this.props.currentUser}
          persistOfflineChapter={this.persistOfflineChapter}
          handleSelectChapter={this.selectChapter}
        />
      </View>
    )
  }

  renderProfileJournals() {
    const pad = Dimensions.get("window").width * 0.035

    return (
      <View style={{ position: "relative", backgroundColor: "white" }}>
        <FlatList
          scrollEnabled={true}
          contentContainerStyle={{
            display: "flex",
            backgroundColor: "white",
            paddingLeft: 15,
            paddingRight: 15,
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap"
          }}
          data={this.props.user.journals}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <JournalMini {...item} handlePress={this.handleJournalPress} />}
        />
      </View>
    )
  }

  navigateToJournalForm = () => {
    this.props.resetJournalShow()
    this.props.navigation.navigate("JournalForm")
  }

  renderCreateJournalCta() {
    return (
      <TouchableWithoutFeedback onPress={this.navigateToJournalForm}>
        <View
          shadowColor="gray"
          shadowOffset={{ width: 1, height: 1 }}
          shadowOpacity={0.5}
          shadowRadius={2}
          style={{
            position: "absolute",
            backgroundColor: "#FF5423",
            width: 60,
            height: 60,
            borderRadius: 30,
            bottom: 17,
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

  renderRelatedProfileContent() {
    switch (this.state.activeTab) {
      case "journals":
        return this.renderProfileJournals()
      case "offlineChapters":
        return this.renderOfflineChapters()
      default:
        console.log("WHAT IS THIS", this.state.activeTab)
    }
  }

  renderFloatingCreateButton() {
    switch (this.state.activeTab) {
      case "journals":
        return this.renderCreateJournalCta()
      case "offlineChapters":
        return this.createOfflineChapters()
    }
  }

  createOfflineChapters() {
    if (!this.props.currentUser.canCreate) return

    return (
      <TouchableWithoutFeedback onPress={this.populateJournalsAndBeginNavigation}>
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
            bottom: 17,
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
    if (this.props.isLoading) {
      return <LoadingScreen />
    }

    return (
      <View style={{ backgroundColor: "white", height: "100%" }}>
        {this.renderProfilePhotoAndMetadata()}
        {this.renderProfileTabBar()}
        <ScrollView>{this.renderRelatedProfileContent()}</ScrollView>
        {this.renderFloatingCreateButton()}
      </View>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile)
