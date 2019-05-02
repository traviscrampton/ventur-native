import React, { Component } from "react"
import { LinearGradient } from "expo"
import { connect } from "react-redux"
import { StyleSheet, ScrollView, View, Text, TouchableWithoutFeedback, TextInput } from "react-native"
import { setToken, API_ROOT } from "agent"
import { updateJournalForm } from "actions/journal_form"
import { Ionicons } from "@expo/vector-icons"

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({})

class CountriesEditor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searchResultCountries: [
        { id: 1, name: "New Zealand" },
        { id: 2, name: "United States" },
        { id: 3, name: "Australia" },
        { id: 4, name: "South Africa" },
        { id: 5, name: "China" }
      ]
    }
  }

  handleTextChange = text => {
    console.log("here comes the text", text)
  }

  renderSearchBar() {
    return (
      <View>
        <TextInput
          style={{ borderWidth: 1, borderColor: "#d3d3d3", borderRadius: 5, padding: 5, fontSize: 18 }}
          autoFocus
          placeholder={"Type to find country"}
          onChange={text => this.handleTextChange(text)}
        />
      </View>
    )
  }

  renderSearchResult(searchCountry) {
    return (
      <View
        style={{ borderBottomWidth: 1, borderBottomColor: "#d3d3d3", padding: 5, paddingTop: 10, paddingBottom: 10 }}
        key={searchCountry.id}>
        <Text style={{ fontSize: 18 }}>{searchCountry.name}</Text>
      </View>
    )
  }

  renderSearchResults() {
    if (this.state.searchResultCountries.length < 1) return

    return (
      <View style={{ borderWidth: 1, borderColor: "#d3d3d3", borderRadius: 5, marginTop: 5 }}>
        {this.state.searchResultCountries.map((searchCountry, index) => {
          return this.renderSearchResult(searchCountry)
        })}
      </View>
    )
  }

  renderAddedCountries() {
    return <Text />
  }

  renderComponents() {
    return Object.assign(
      {},
      {
        searchBar: this.renderSearchBar(),
        searchResults: this.renderSearchResults(),
        addedCountries: this.renderAddedCountries()
      }
    )
  }

  render() {
    const { searchBar, searchResults, addedCountries } = this.renderComponents()

    return (
      <View style={styles.container}>
        <View>
          {searchBar}
          {searchResults}
        </View>
        {addedCountries}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    marginTop: 75
  },
  formTitle: {},
  title: {}
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CountriesEditor)
