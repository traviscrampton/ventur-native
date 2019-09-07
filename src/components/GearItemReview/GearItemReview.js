import React, { Component } from "react"
import { connect } from "react-redux"
import { StyleSheet, ScrollView, View, Text, Modal, TouchableWithoutFeedback, TextInput } from "react-native"

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({})

class GearItemReview extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <View />
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
)(GearItemReview)
