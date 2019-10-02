import React, { Component } from "react"
import { LinearGradient } from "expo"
import { connect } from "react-redux"
import { Header } from "../editor/header"
import { StackActions, NavigationActions } from "react-navigation"
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Modal,
  Text,
  TouchableWithoutFeedback,
  TextInput
} from "react-native"
import { setToken, API_ROOT } from "../../agent"
import {
  updateJournalForm,
  resetJournalForm,
  persistJournal,
  toggleJournalFormModal,
  toggleCountriesEditorModal
} from "../../actions/journal_form"
import CountriesEditor from "./CountriesEditor"
import FormModal from "../shared/FormModal"

const mapStateToProps = state => ({
  id: state.journalForm.id,
  title: state.journalForm.title,
  height: state.common.height,
  description: state.journalForm.description,
  status: state.journalForm.status,
  includedCountries: state.journalForm.includedCountries,
  distanceType: state.journalForm.distanceType,
  currentRoot: state.common.currentBottomTab,
  visible: state.journalForm.visible
})

const mapDispatchToProps = dispatch => ({
  updateJournalForm: payload => dispatch(updateJournalForm(payload)),
  toggleJournalFormModal: payload => dispatch(toggleJournalFormModal(payload)),
  toggleCountriesEditorModal: payload => dispatch(toggleCountriesEditorModal(payload)),
  resetJournalForm: () => dispatch(resetJournalForm()),
  persistJournal: callback => dispatch(persistJournal(callback))
})

class JournalForm extends Component {
  constructor(props) {
    super(props)
  }

  static STATUS_OPTIONS = ["not_started", "active", "paused", "completed"]
  static DISTANCE_OPTIONS = ["kilometers", "miles"]

  updateJournalForm = (key, value) => {
    const payload = Object.assign({}, { [key]: value })
    this.props.updateJournalForm(payload)
  }

  saveJournal = () => {
    this.props.persistJournal(this.navigateToJournal)
  }

  navigateToJournal = () => {
    this.props.toggleJournalFormModal(false)
  }

  handleGoBack = () => {
    this.props.toggleJournalFormModal(false)
    this.props.resetJournalForm()
  }

  toggleFormButton = (buttonType, currentOption) => {
    const options = this.getOptionArray(buttonType)
    const currentIndex = options.indexOf(currentOption)
    const newOption = currentIndex === options.length - 1 ? options[0] : options[currentIndex + 1]

    this.updateJournalForm(buttonType, newOption)
  }

  navigateToCountriesEditor = () => {
    this.props.toggleCountriesEditorModal(true)
  }

  getOptionArray(buttonType) {
    switch (buttonType) {
      case "status":
        return JournalForm.STATUS_OPTIONS
      case "distanceType":
        return JournalForm.DISTANCE_OPTIONS
      default:
        return []
    }
  }

  renderFormTitle() {
    const formTitle = this.props.id ? "Edit Journal" : "New Journal"

    return (
      <View style={styles.formTitle}>
        <Text style={styles.title}>{formTitle}</Text>
      </View>
    )
  }

  renderTextFields() {
    return (
      <View style={{ marginBottom: 15 }}>
        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontFamily: "playfair", color: "#323941", marginBottom: 5, fontSize: 16 }}>Title</Text>
          <TextInput
            shadowColor="gray"
            shadowOffset={{ width: 0, height: 0 }}
            shadowOpacity={0.5}
            shadowRadius={2}
            style={{
              backgroundColor: "white",
              fontSize: 18,
              borderWidth: 1,
              padding: 5,
              borderRadius: 5,
              borderColor: "#d3d3d3"
            }}
            selectionColor="#FF5423"
            onChangeText={text => this.updateJournalForm("title", text)}
            value={this.props.title}
          />
        </View>
        <View>
          <Text style={{ fontFamily: "playfair", color: "#323941", marginBottom: 5, fontSize: 16 }}>Description</Text>
          <TextInput
            shadowColor="gray"
            shadowOffset={{ width: 0, height: 0 }}
            shadowOpacity={0.5}
            shadowRadius={2}
            multiline
            minHeight={18 * 4}
            maxLength={200}
            value={this.props.description}
            selectionColor="#FF5423"
            style={{
              backgroundColor: "white",
              fontSize: 18,
              borderWidth: 1,
              padding: 5,
              borderRadius: 5,
              borderColor: "#d3d3d3"
            }}
            onChangeText={text => this.updateJournalForm("description", text)}
          />
        </View>
      </View>
    )
  }

  renderDistanceType() {
    const distanceType = this.props.distanceType.toUpperCase()

    return (
      <View>
        <Text style={{ fontFamily: "playfair", color: "#323941", marginBottom: 5, fontSize: 16 }}>Distance Type</Text>
        <TouchableWithoutFeedback onPress={() => this.toggleFormButton("distanceType", this.props.distanceType)}>
          <View
            shadowColor="gray"
            shadowOffset={{ width: 0, height: 0 }}
            shadowOpacity={0.5}
            shadowRadius={2}
            style={{
              display: "flex",
              borderWidth: 1,
              backgroundColor: "white",
              padding: 7,
              borderRadius: 5,
              borderColor: "#d3d3d3",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 15
            }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>{distanceType}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderStatusCta() {
    const status = this.props.status.replace("_", " ").toUpperCase()

    return (
      <View>
        <Text style={{ fontFamily: "playfair", color: "#323941", marginBottom: 5, fontSize: 16 }}>Status</Text>
        <TouchableWithoutFeedback onPress={() => this.toggleFormButton("status", this.props.status)}>
          <View
            shadowColor="gray"
            shadowOffset={{ width: 0, height: 0 }}
            shadowOpacity={0.5}
            shadowRadius={2}
            style={{
              display: "flex",
              borderWidth: 1,
              backgroundColor: "white",
              padding: 7,
              borderRadius: 5,
              borderColor: "#d3d3d3",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 15
            }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>{status}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderIncludedCountry(includedCountry) {
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: "#d3d3d3",
          borderRadius: 5,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 5,
          marginRight: 10,
          marginBottom: 10
        }}
        key={includedCountry.id}>
        <Text style={{ fontSize: 18 }}>{includedCountry.name}</Text>
      </View>
    )
  }

  renderCountries() {
    return (
      <View>
        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontFamily: "playfair", color: "#323941", marginBottom: 5, fontSize: 16 }}>Country Tags</Text>
          <TouchableWithoutFeedback onPress={this.navigateToCountriesEditor}>
            <View>
              <Text style={{ fontSize: 16 }}>Edit</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={{ marginTop: 10, display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
          {this.props.includedCountries.map((includedCountry, index) => {
            return this.renderIncludedCountry(includedCountry)
          })}
        </View>
      </View>
    )
  }

  renderHeader() {
    const headerProps = Object.assign(
      {},
      {
        goBackCta: "Cancel",
        handleGoBack: this.handleGoBack,
        centerCta: "",
        handleConfirm: this.saveJournal,
        confirmCta: "Save"
      }
    )
    return <Header key="header" {...headerProps} />
  }

  renderFormComponents() {
    return Object.assign(
      {},
      {
        formTitle: this.renderFormTitle(),
        textFields: this.renderTextFields(),
        status: this.renderStatusCta(),
        distanceType: this.renderDistanceType(),
        countries: this.renderCountries(),
        header: this.renderHeader()
      }
    )
  }

  render() {
    const { formTitle, textFields, status, header, distanceType, countries } = this.renderFormComponents()
    return (
      <FormModal visible={this.props.visible}>
        {header}
        <ScrollView style={[styles.container, { minHeight: this.props.height }]}>
          {formTitle}
          {textFields}
          {status}
          {distanceType}
          {countries}
          <View style={{ marginBottom: 200 }} />
        </ScrollView>
        <CountriesEditor includedCountries={this.props.includedCountries} />
      </FormModal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    paddingTop: 15
  },
  formTitle: {
    marginBottom: 25
  },
  title: {
    fontSize: 25,
    fontWeight: "bold"
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JournalForm)
