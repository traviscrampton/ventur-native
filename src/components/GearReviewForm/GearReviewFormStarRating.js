import React, { Component } from "react"
import { ScrollView, View, Modal, Dimensions, Text, TextInput, TouchableWithoutFeedback } from "react-native"
import { connect } from "react-redux"
import { MaterialIcons } from "@expo/vector-icons"
import { updateGearReviewFormStarRating } from "../../actions/gear_review_form"

const mapStateToProps = state => ({
  width: state.common.width,
  rating: state.gearReviewForm.rating
})

const mapDispatchToProps = dispatch => ({
  updateGearReviewFormStarRating: payload => dispatch(updateGearReviewFormStarRating(payload))
})

class GearReviewFormStarRating extends Component {
  constructor(props) {
    super(props)
  }

  static MAX_STARS = 5

  renderStar(i) {
    if (this.props.rating >= i + 1) {
      return <MaterialIcons name="star" color="gold" size={32} key={i} />
    }

    return <MaterialIcons name="star-border" color="gold" size={32} key={i} />
  }

  renderStars = () => {
    return [...Array(GearReviewFormStarRating.MAX_STARS)].map((e, i) => {
      return (
        <TouchableWithoutFeedback onPress={() => this.props.updateGearReviewFormStarRating(i + 1)}>
          {this.renderStar(i)}
        </TouchableWithoutFeedback>
      )
    })
  }

  render() {
    return (
      <View style={{ marginTop: 10 }}>
        <View style={{ marginBottom: 5 }}>
          <Text style={{ fontFamily: "open-sans-bold", fontSize: 18 }}>Rating</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>{this.renderStars()}</View>
      </View>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GearReviewFormStarRating)
