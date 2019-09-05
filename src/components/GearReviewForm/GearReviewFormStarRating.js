import React, { Component } from "react"
import { ScrollView, View, Modal, Dimensions, Text, TextInput, TouchableWithoutFeedback } from "react-native"
import { connect } from "react-redux"
import { MaterialIcons } from "@expo/vector-icons"

const mapStateToProps = state => ({
  width: state.common.width
})

const mapDispatchToProps = dispatch => ({})

class GearReviewFormStarRating extends Component {
  constructor(props) {
    super(props)
  }

  renderStars = () => {
    return [...Array(5)].map((e, i) => {
      // TODO: Make a 
      return <MaterialIcons name="star-border" color="gold" size={32} key={i} />
    })
  }

  render() {
    return (
      <View style={{ marginTop: 10 }}>
        <View style={{ marginBottom: 5 }}>
          <Text style={{ fontFamily: "open-sans-bold", fontSize: 18 }}>Rating</Text>
        </View>
        <View style={{display: "flex", flexDirection: "row"}}>
          {this.renderStars()}
        </View>  
      </View>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GearReviewFormStarRating)
