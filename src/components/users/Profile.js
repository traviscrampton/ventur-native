import React, { Component } from "react"
import { resetChapter } from "actions/chapter"
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  AsyncStorage,
  Dimensions,
  ImageBackground,
  TouchableWithoutFeedback
} from "react-native"
import ChapterList from "components/chapters/ChapterList"
import { MaterialIcons, Feather } from "@expo/vector-icons"
import { populateUserPage, populateOfflineChapters } from "actions/user"
import JournalMini from "components/journals/JournalMini"
import { userQuery } from "graphql/queries/users"
import { gql } from "agent"
import ChapterUserForm from "components/chapters/ChapterUserForm"
import { updateChapterForm } from "actions/chapter_form"
import { loadChapter } from "actions/chapter"
import { setCurrentUser } from "actions/common"
import { connect } from "react-redux"
import { Ionicons, Entypo } from "@expo/vector-icons"
import { RESET_JOURNAL_TAB } from "actions/action_types"
import { addJournalsToAsyncStorage } from "utils/offline_helpers"
import DropDownHolder from "utils/DropdownHolder"
import { logOut } from "auth"
import { getChapterFromStorage, updateOfflineChapters } from "utils/offline_helpers"
import { setToken, API_ROOT } from "agent"

const mapStateToProps = state => ({
  currentUser: state.common.currentUser,
  user: state.user.user,
  offlineChapters: state.user.offlineChapters
})

const mapDispatchToProps = dispatch => ({
  populateUserPage: payload => dispatch(populateUserPage(payload)),
  populateOfflineChapters: payload => dispatch(populateOfflineChapters(payload)),
  setCurrentUser: payload => dispatch(setCurrentUser(payload)),
  loadChapter: payload => dispatch(loadChapter(payload)),
  updateChapterForm: payload => dispatch(updateChapterForm(payload)),
  resetJournal: () => {
    dispatch({ type: RESET_JOURNAL_TAB })
  }
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
    Expo.ScreenOrientation.allow("PORTRAIT_UP")
    this.getProfilePageData()
    this.getOfflineChapters()
  }

  getProfilePageData() {
    if (this.props.currentUser) {
      gql(userQuery, { id: this.props.currentUser.id }).then(res => {
        this.props.populateUserPage(res.user)
        addJournalsToAsyncStorage(res.user.journals)
      })
    }
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
      return { backgroundColor: "#FF8C34", color: "white", borderColor: "#FF8C34" }
    }
  }

  handleLogout = async () => {
    await logOut()
    this.props.setCurrentUser(null)
  }

  handleJournalPress = journalId => {
    this.props.resetJournal()
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

  renderUserName() {
    return (
      <View style={{ height: Dimensions.get("window").width / 4, display: "flex", flexDirection: "column" }}>
        <View>
          <Text style={{ fontFamily: "playfair", fontSize: 22, marginBottom: 5, fontWeight: "bold" }}>
            Hi {this.props.user.firstName}!
          </Text>
        </View>
        <View>
          <Text style={{ width: Dimensions.get("window").width * 0.68 - 30 }}>Welcome to your content portal!</Text>
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

    const options = [{ type: "touchable", title: "Log Out", callback: this.handleLogout }]
    return <ChapterUserForm options={options} styles={{ right: -5, top: 25, width: 100 }} />
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

    formData.append("title", offlineChapter.title)
    formData.append("status", offlineChapter.status)
    formData.append("journalId", offlineChapter.journalId)
    formData.append("offline", offlineChapter.offline)
    formData.append("date", offlineChapter.date)
    formData.append("distance", offlineChapter.distance)
    formData.append("banner_image", offlineChapter.bannerImage)
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
    this.props.navigation.navigate("JournalFormTitle")
  }

  renderCreateJournalCta() {
   if (!this.props.currentUser.canCreate) return

    return (
      <TouchableWithoutFeedback onPress={this.navigateToJournalForm}>
        <View
          shadowColor="gray"
          shadowOffset={{ width: 1, height: 1 }}
          shadowOpacity={0.5}
          shadowRadius={2}
          style={{
            position: "absolute",
            backgroundColor: "#FF8C34",
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
            backgroundColor: "#067BC2",
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
