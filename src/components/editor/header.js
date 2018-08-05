import React, { Component } from "react"
import { connect } from "react-redux"
import { updateActiveImageCaption, updateImageCaption, updateActiveIndex } from "actions/editor"
import { Text, TouchableWithoutFeedback, TextInput, StyleSheet, View, Image, Dimensions } from "react-native"

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({})

class Header extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View
        key="header"
        style={{
          display: "flex",
          height: 60,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: 10,
          paddingLeft: 10,
          paddingRight: 10
        }}>
        <TouchableWithoutFeedback onPress={this.props.handleGoBack}>
          <View>
            <Text>{this.props.goBackCta}</Text>
          </View>
        </TouchableWithoutFeedback>
        <View>
          <Text>{this.props.centerCta}</Text>
        </View>
        <TouchableWithoutFeedback onPress={this.props.handleConfirm}>
          <View>
            <Text>{this.props.confirmCta}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)
