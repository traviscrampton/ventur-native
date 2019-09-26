import React, { Component } from "react"
import {
  ScrollView,
  View,
  Modal,
  SafeAreaView,
  Image,
  Dimensions,
  Text,
  TextInput,
  TouchableWithoutFeedback
} from "react-native"
import { connect } from "react-redux"
import { getUserJournals, handleJournalPress } from "../../actions/gear_review_form"
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons"

const mapStateToProps = state => ({
  width: state.common.width,
  journals: state.gearReviewForm.userJournals,
  journalIds: state.gearReviewForm.journalIds
})

const mapDispatchToProps = dispatch => ({
  getUserJournals: payload => dispatch(getUserJournals(payload)),
  handleJournalPress: payload => dispatch(handleJournalPress(payload))
})

class GearReviewFormJournals extends Component {
  constructor(props) {
    super(props)

    this.state = {
      menuOpen: false
    }
  }

  componentWillMount() {
    this.props.getUserJournals()
  }

  toggleMenu = () => {
    const { menuOpen } = this.state

    this.setState({
      menuOpen: !menuOpen
    })
  }

  handleJournalPress = id => {
    this.props.handleJournalPress(id)
  }

  renderJournalOption = (journal, index) => {
    const isIncluded = this.props.journalIds.includes(journal.id)

    return (
      <TouchableWithoutFeedback key={journal.id} onPress={() => this.handleJournalPress(journal.id)}>
        <View
          key={journal.id}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            paddingRight: 10,
            alignItems: "center",
            justifyContent: "space-between"
          }}>
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <Image source={{ uri: journal.cardBannerImageUrl }} style={{ width: 50, height: 50 }} />
            <Text>{journal.title}</Text>
          </View>
          <MaterialCommunityIcons
            name={"check-circle-outline"}
            size={25}
            color={isIncluded ? "#82CA9C" : "lightgray"}
          />
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderJournalOptions() {
    return this.props.journals.map((journal, index) => {
      return this.renderJournalOption(journal, index)
    })
  }

  renderDropdown = () => {
    if (!this.state.menuOpen) return

    return (
      <View shadowColor="gray" shadowOffset={{ width: 0, height: 0 }} shadowOpacity={0.5} shadowRadius={2}>
        <View style={{ backgroundColor: "white", borderRadius: 5, marginTop: 10, overflow: "hidden" }}>
          {this.renderJournalOptions()}
        </View>
      </View>
    )
  }

  renderSelectedJournals = () => {
    return <View />
  }

  getJournalLabelText() {
    const { journalIds } = this.props
    let journal = "Journal"

    if (journalIds.length === 0 || journalIds.length > 1) {
      journal = "Journals"
    }

    return `${journalIds.length} ${journal} selected`
  }

  renderDropdownIcon() {
    const icon = this.state.menuOpen ? "chevron-down" : "chevron-up"

    return <MaterialCommunityIcons name={icon} size={20} />
  }

  render() {
    return (
      <View>
        <TouchableWithoutFeedback onPress={this.toggleMenu}>
          <View
            style={{
              height: 50,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "white",
              alignItems: "center",
              paddingRight: 15,
              paddingLeft: 15,
              width: "100%",
              borderRadius: 5
            }}
            shadowColor="gray"
            shadowOffset={{ width: 0, height: 0 }}
            shadowOpacity={0.5}
            shadowRadius={2}>
            <Text>{this.getJournalLabelText()}</Text>
            {this.renderDropdownIcon()}
          </View>
        </TouchableWithoutFeedback>
        {this.renderDropdown()}
        {this.renderSelectedJournals()}
      </View>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GearReviewFormJournals)
