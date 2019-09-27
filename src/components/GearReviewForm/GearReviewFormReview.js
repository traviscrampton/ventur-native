import React, { Component } from "react"
import { View, Text, TextInput } from "react-native"
import { connect } from "react-redux"
import { updateGearReviewFormReview } from "../../actions/gear_review_form"
import { MaterialCommunityIcons } from "@expo/vector-icons"

const mapStateToProps = state => ({
  width: state.common.width,
  review: state.gearReviewForm.review
})

const mapDispatchToProps = dispatch => ({
  updateGearReviewFormReview: payload => dispatch(updateGearReviewFormReview(payload))
})

class GearReviewFormReview extends Component {
  constructor(props) {
    super(props)
  }

  updateGearReviewFormReview = text => {
    this.props.updateGearReviewFormReview(text)
  }

  render() {
    return (
      <View style={{ marginTop: 20 }}>
        <View style={{ marginBottom: 5 }}>
          <Text style={{ fontFamily: "playfair", color: "#323941", fontSize: 18 }}>Review</Text>
        </View>
        <TextInput
          shadowColor="gray"
          shadowOffset={{ width: 0, height: 0 }}
          shadowOpacity={0.5}
          shadowRadius={2}
          multiline
          style={{
            fontSize: 18,
            backgroundColor: "white",
            borderWidth: 1,
            height: 100,
            fontFamily: "open-sans-regular",
            padding: 5,
            borderRadius: 5,
            borderColor: "#d3d3d3"
          }}
          selectionColor="#FF5423"
          onChangeText={text => this.updateGearReviewFormReview(text)}
          value={this.props.review}
        />
      </View>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GearReviewFormReview)
