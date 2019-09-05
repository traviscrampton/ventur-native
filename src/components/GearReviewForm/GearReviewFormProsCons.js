import React, { Component } from "react"
import { ScrollView, View, Modal, Dimensions, Text, FlatList, TouchableWithoutFeedback } from "react-native"
import { connect } from "react-redux"
import { MaterialCommunityIcons } from "@expo/vector-icons"

const mapStateToProps = state => ({
  width: state.common.width
})

const mapDispatchToProps = dispatch => ({})

class GearReviewFormProsCons extends Component {
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
          <Text style={{ fontFamily: "open-sans-bold", fontSize: 18 }}>Pros</Text>
          {this.renderPros()}
          <View><Text>+ Add Pro</Text></View>
        </View>
        <View style={{ marginBottom: 5 }}>
          <Text style={{ fontFamily: "open-sans-bold", fontSize: 18 }}>Cons</Text>
          {this.renderCons()}
          <View><Text>+ Add Con</Text></View>
        </View>
      </View>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GearReviewFormProsCons)
