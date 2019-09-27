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
import GearListItem from "../GearItem/GearListItem"
import { MaterialIcons, Feather } from "@expo/vector-icons"
import { populateUserPage, populateOfflineChapters, getProfilePageData } from "../../actions/user"
import JournalMini from "../journals/JournalMini"
import JournalForm from "../JournalForm/JournalForm"
import ChapterUserForm from "../chapters/ChapterUserForm"
import { updateChapterForm } from "../../actions/chapter_form"
import { loadChapter } from "../../actions/chapter"
import { toggleJournalFormModal } from "../../actions/journal_form"
import { loadSingleJournal, resetJournalShow } from "../../actions/journals"
import { setCurrentUser } from "../../actions/common"
import { authenticateStravaUser } from "../../actions/strava"
import { connect } from "react-redux"
import ThreeDotDropdown from "../shared/ThreeDotDropdown"
import { populateGearItemReview } from "../../actions/gear_item_review"
import { logOut } from "../../auth"
import { getChapterFromStorage, updateOfflineChapters } from "../../utils/offline_helpers"
import { setToken, API_ROOT, encodeQueryString, get } from "../../agent"
import LoadingScreen from "../shared/LoadingScreen"
import { WebBrowser } from "expo"
import Expo from "expo"
import SlidingTabs from "../shared/SlidingTabs"

const mapStateToProps = state => ({
  currentUser: state.common.currentUser,
  stravaClientId: state.common.stravaClientId,
  user: state.user.user,
  gear: state.user.user.gear,
  journals: state.user.user.journals,
  width: state.common.width
})

const mapDispatchToProps = dispatch => ({
  populateUserPage: payload => dispatch(populateUserPage(payload)),
  populateOfflineChapters: payload => dispatch(populateOfflineChapters(payload)),
  setCurrentUser: payload => dispatch(setCurrentUser(payload)),
  loadChapter: payload => dispatch(loadChapter(payload)),
  toggleJournalFormModal: payload => dispatch(toggleJournalFormModal(payload)),
  updateChapterForm: payload => dispatch(updateChapterForm(payload)),
  loadSingleJournal: payload => dispatch(loadSingleJournal(payload)),
  resetJournalShow: () => dispatch(resetJournalShow()),
  authenticateStravaUser: payload => dispatch(authenticateStravaUser(payload)),
  getProfilePageData: () => dispatch(getProfilePageData()),
  populateGearItemReview: payload => dispatch(populateGearItemReview(payload))
})

class Profile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeIndex: 0
    }
  }

  componentWillMount() {
    this.props.getProfilePageData()
  }

  handleLogout = async () => {
    await logOut()
    this.props.setCurrentUser(null)
  }

  handleJournalPress = journalId => {
    this.props.navigation.navigate("Journal", { journalId })
  }

  connectToStrava = async () => {
    if (this.props.currentUser.stravaAccessToken) return

    this.setState({ userMenuOpen: false })
    const redirect = "ventur://ventur"
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
      <View style={{ height: this.props.width / 4, display: "flex", flexDirection: "column" }}>
        <View>
          <Text style={{ fontFamily: "playfair", fontSize: 22, marginBottom: 5, fontWeight: "bold" }}>
            Hi {this.props.user.firstName}!
          </Text>
        </View>
        <View>
          <Text style={{ width: this.props.width * 0.68 - 40 }} />
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
    let imgDimensions = this.props.width / 4
    const options = this.getOptions()

    return (
      <View
        style={{
          display: "flex",
          width: this.props.width - 30,
          flexDirection: "row",
          alignItems: "top",
          paddingRight: 20
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
        <ThreeDotDropdown options={options} />
      </View>
    )
  }

  getOptions() {
    const options = [
      { title: this.stravaCtaText(), callback: this.connectToStrava },
      { title: "Log Out", callback: this.handleLogout }
    ]

    return options
  }

  renderProfilePhotoAndMetadata() {
    return (
      <View
        style={{
          padding: 15,
          marginTop: 20,
          backgroundColor: "white",
          width: this.props.width - 30
        }}>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "top", justifyContent: "space-between" }}>
          {this.renderProfilePhoto()}
        </View>
      </View>
    )
  }

  handleGearItemPress = id => {
    const payload = Object.assign({}, { id, loading: true })

    this.props.populateGearItemReview(payload)
    this.props.navigation.navigate("GearItemReview")
  }

  renderGear() {
    return this.props.gear.map((gearItem, index) => {
      return <GearListItem gearItem={gearItem} gearItemPress={() => this.handleGearItemPress(gearItem.id)} />
    })
  }

  renderProfileJournals() {
    const pad = this.props.width * 0.035

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
            marginTop: 10
          }}
          data={this.props.journals}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <JournalMini {...item} handlePress={this.handleJournalPress} />}
        />
      </View>
    )
  }

  navigateToJournalForm = () => {
    this.props.resetJournalShow()
    this.props.toggleJournalFormModal(true)
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

  renderFloatingCreateButton() {
    return this.renderCreateJournalCta()
  }

  handleIndexChange = activeIndex => {
    this.setState({ activeIndex })
  }

  getTabProps = () => {
    return Object.assign(
      [],
      [
        Object.assign(
          {},
          {
            label: "JOURNALS",
            view: this.renderProfileJournals()
          }
        ),
        Object.assign({
          label: "GEAR",
          view: this.renderGear()
        })
      ]
    )
  }

  renderSlidingTabs() {
    const tabs = this.getTabProps()
    const tabWidth = (this.props.width - 40) / tabs.length

    return (
      <SlidingTabs
        tabs={tabs}
        tabWidth={tabWidth}
        tabBarColor="#FF5423"
        activeIndex={this.state.activeIndex}
        onIndexChange={this.handleIndexChange}
      />
    )
  }

  render() {
    if (this.props.isLoading) {
      return <LoadingScreen />
    }

    return (
      <View style={{ backgroundColor: "white", height: "100%" }}>
        <ScrollView>
          {this.renderProfilePhotoAndMetadata()}
          {this.renderSlidingTabs()}
        </ScrollView>
        {this.renderFloatingCreateButton()}
        <JournalForm />
      </View>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile)
