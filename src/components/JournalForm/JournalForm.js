import React, { Component } from "react"
import { LinearGradient } from "expo"
import { connect } from "react-redux"
import { StyleSheet, ScrollView, View, Text, TouchableWithoutFeedback, TextInput } from "react-native"
import { setToken, API_ROOT } from "agent"
import { updateJournalForm } from "actions/journal_form"
import { Ionicons } from "@expo/vector-icons"

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({})

class JournalForm extends Component {
  constructor(props) {
    super(props)
  }

  renderFormTitle() {
    return (
      <View style={styles.formTitle}>
        <Text style={styles.title}>Journal</Text>
      </View>
    )
  }

  renderTextFields() {
    return (
      <View>
        <View>
          <TextInput placeholder={"Title"} />
        </View>
        <View>
          <TextInput placeholder={"Description"} />
        </View>
      </View>
    )
  }

  renderStatusCta() {
    return (
      <View>
        <TouchableWithoutFeedback onPress={() => console.log("hit!")}>
          <View>
            <Text>Active</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderCountries() {
    return <View />
  }

  renderFormComponents() {
    return Object.assign(
      {},
      {
        formTitle: this.renderFormTitle(),
        textFields: this.renderTextFields(),
        status: this.renderStatusCta(),
        countries: this.renderCountries()
      }
    )
  }

  render() {
    const { formTitle, textFields, status } = this.renderFormComponents()
    return (
      <ScrollView style={styles.container}>
        {formTitle}
        {textFields}
        {status}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {},
  formTitle: {},
  title: {}
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JournalForm)
