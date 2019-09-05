import React, { Component } from "react"
import { View, Text, TextInput } from "react-native"
import { connect } from "react-redux"
import { MaterialCommunityIcons } from "@expo/vector-icons"

const mapStateToProps = state => ({
  width: state.common.width
})

const mapDispatchToProps = dispatch => ({})

class GearReviewFormReview extends Component {
  constructor(props) {
    super(props)
  }

  renderPros = () => {
    return <View />
  }

  renderCons = () => {
    return <View />
  }

  render() {
    return (
      <View style={{ marginTop: 10 }}>
        <View style={{ marginBottom: 5 }}>
          <Text style={{ fontFamily: "open-sans-bold", fontSize: 18 }}>Description</Text>
        </View>
        <TextInput
          multiline
          style={{
            fontSize: 18,
            borderWidth: 1,
            height: 200,
            fontFamily: "open-sans-regular",
            padding: 5,
            borderRadius: 5,
            borderColor: "#d3d3d3"
          }}
          selectionColor="#FF5423"
          onChangeText={text => console.log("text", text)}
          value={""}
        />
      </View>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GearReviewFormReview)
