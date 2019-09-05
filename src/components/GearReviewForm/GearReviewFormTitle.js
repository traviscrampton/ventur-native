import React, { Component } from "react"
import { ScrollView, View, Modal, Dimensions, Text, TextInput, TouchableWithoutFeedback } from "react-native"
import { connect } from "react-redux"

const mapStateToProps = state => ({
  width: state.common.width,
  name: state.gearReviewForm.name
})

const mapDispatchToProps = dispatch => ({})

class GearReviewFormTitle extends Component {
  constructor(props) {
    super(props)
  }

  renderGearDropdown() {
    return
    return (
      <View
        style={{
          width: this.props.width - 40,
          top: 65,
          position: "absolute",
          height: 100,
          backgroundColor: "white",
          borderWidth: 1,
          borderRadius: 5,
          borderColor: "#d3d3d3"
        }}
      />
    )
  }

  render() {
    return (
      <View style={{ position: "relative" }}>
        <View style={{ marginBottom: 5 }}>
          <Text style={{ fontFamily: "open-sans-bold", fontSize: 18 }}>Name</Text>
        </View>
        <TextInput
          style={{
            fontSize: 18,
            borderWidth: 1,
            fontFamily: "open-sans-regular",
            padding: 5,
            borderRadius: 5,
            borderColor: "#d3d3d3"
          }}
          selectionColor="#FF5423"
          onChangeText={text => console.log("text", text)}
          value={this.props.name}
        />
        {this.renderGearDropdown()}
      </View>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GearReviewFormTitle)
