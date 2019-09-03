import React, { Component } from "react"
import { LinearGradient } from "expo"
import { connect } from "react-redux"
import { StyleSheet, ScrollView, View, Text, Modal, TouchableWithoutFeedback, TextInput } from "react-native"
import { get } from "../../agent"
import { Header } from "../editor/header"
import { updateJournalForm, toggleCountriesEditorModal } from "../../actions/journal_form"
import { Feather } from "@expo/vector-icons"

const mapStateToProps = state => ({
  includedCountries: state.journalForm.includedCountries,
  visible: state.journalForm.countriesEditorVisible
})

const mapDispatchToProps = dispatch => ({
  updateJournalForm: payload => dispatch(updateJournalForm(payload)),
  toggleCountriesEditorModal: payload => dispatch(toggleCountriesEditorModal(payload)),
})

class CountriesEditor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searchText: "",
      searchResultCountries: [],
      includedCountries: props.includedCountries
    }
  }

  handleTextChange = text => {
    this.setState({ searchText: text }, this.searchForCountries)
  }

  searchForCountries() {
    get("/countries/search_countries", { name: this.state.searchText }).then(res => {
      this.setState({ searchResultCountries: res.countries })
    })
  }

  countryAlreadyIncluded = searchCountry => {
    const includedCountryIds = this.state.includedCountries.map(includedCountry => {
      return includedCountry.id
    })

    return includedCountryIds.includes(searchCountry.id)
  }

  addCountries = () => {
    const { includedCountries } = this.state
    const payload = Object.assign({}, { includedCountries })
    this.props.updateJournalForm(payload)
    this.handleGoBack()
  }

  handleGoBack = () => {
    const { includedCountries } = this.props
    this.setState({ includedCountries })
    this.props.toggleCountriesEditorModal(false)
  }

  includeCountry = searchCountry => {
    if (this.countryAlreadyIncluded(searchCountry)) return

    const newIncludedCountries = [...this.state.includedCountries, searchCountry]
    this.setState({ includedCountries: newIncludedCountries, searchText: "" })
  }

  removeCountry = countryToRemove => {
    const newCountries = this.state.includedCountries.filter(
      includedCountry => includedCountry.id !== countryToRemove.id
    )

    this.setState({ includedCountries: newCountries })
  }

  renderSearchBar() {
    return (
      <View>
        <TextInput
          style={{ borderWidth: 1, borderColor: "#d3d3d3", borderRadius: 5, padding: 5, fontSize: 18 }}
          autoFocus
          selectionColor="#FF5423"
          value={this.state.searchText}
          placeholder={"Type to find country"}
          onChangeText={text => this.handleTextChange(text)}
        />
      </View>
    )
  }

  renderSearchResult(searchCountry) {
    return (
      <TouchableWithoutFeedback onPress={() => this.includeCountry(searchCountry)}>
        <View
          style={{
            borderBottomWidth: 1,
            backgroundColor: "white",
            borderBottomColor: "#d3d3d3",
            padding: 5,
            paddingTop: 10,
            paddingBottom: 10
          }}
          key={searchCountry.id}>
          <Text style={{ fontSize: 18 }}>{searchCountry.name}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderSearchResults() {
    if (this.state.searchText.length < 1 || this.state.searchResultCountries.lengty < 1) return

    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: "#d3d3d3",
          borderRadius: 5,
          marginTop: 5,
          position: "absolute",
          top: 35,
          width: "100%",
          backgroundColor: "white"
        }}>
        {this.state.searchResultCountries.map((searchCountry, index) => {
          return this.renderSearchResult(searchCountry)
        })}
      </View>
    )
  }

  renderIncludedCountryTab(includedCountry, index) {
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
        <TouchableWithoutFeedback onPress={() => this.removeCountry(includedCountry)}>
          <Feather style={{ marginLeft: 15 }} name="x" size={18} />
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderHeader() {
    const headerProps = Object.assign(
      {},
      {
        goBackCta: "Cancel",
        handleGoBack: this.handleGoBack,
        centerCta: "Add Countries",
        handleConfirm: this.addCountries,
        confirmCta: "Done"
      }
    )
    return <Header key="header" {...headerProps} />
  }

  renderIncludedCountries() {
    return (
      <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", marginTop: 20 }}>
        {this.state.includedCountries.map((includedCountry, index) => {
          return this.renderIncludedCountryTab(includedCountry, index)
        })}
      </View>
    )
  }

  renderComponents() {
    return Object.assign(
      {},
      {
        searchBar: this.renderSearchBar(),
        searchResults: this.renderSearchResults(),
        includedCountries: this.renderIncludedCountries(),
        header: this.renderHeader()
      }
    )
  }

  render() {
    const { searchBar, searchResults, includedCountries, header } = this.renderComponents()

    return (
      <Modal visible={this.props.visible} animationType="slide" style={{ backgroundColor: "white", height: "100%" }}>
        {header}
        <View style={styles.container}>
          <View style={{ position: "relative", zIndex: 10 }}>
            {searchBar}
            {searchResults}
          </View>
          {includedCountries}
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    marginTop: 10
  },
  formTitle: {},
  title: {}
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CountriesEditor)
