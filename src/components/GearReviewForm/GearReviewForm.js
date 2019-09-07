import React, { Component } from "react"
import { ScrollView, View, Modal, Dimensions, Text, TextInput, TouchableWithoutFeedback } from "react-native"
import { connect } from "react-redux"
import { persistGearReview } from "../../actions/gear_review_form"
import GearReviewFormTitle from "./GearReviewFormTitle"
import GearReviewFormStarRating from "./GearReviewFormStarRating"
import GearReviewFormImageCarousel from "./GearReviewFormImageCarousel"
import GearReviewFormProsCons from "./GearReviewFormProsCons"
import GearReviewFormReview from "./GearReviewFormReview"

const mapStateToProps = state => ({
  visible: state.gearReviewForm.visible
})

const mapDispatchToProps = dispatch => ({
  persistGearReview: () => dispatch(persistGearReview())
})

class GearReviewForm extends Component {
  constructor(props) {
    super(props)
  }

  persistGearReview = () => {
    this.props.persistGearReview()
  }

  renderHeader() {
    return (
      <View
        style={{
          height: 45,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingRight: 20,
          paddingLeft: 20,
          backgroundColor: "white",
          borderBottomWidth: 1,
          borderBottomColor: "#f8f8f8"
        }}>
        <TouchableWithoutFeedback onPress={() => console.log("DO SOMETHING")}>
          <View>
            <Text style={{ fontFamily: "open-sans-bold", fontWeight: "600", fontSize: 14, color: "#323941" }}>
              Cancel
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.persistGearReview}>
          <View>
            <Text style={{ fontFamily: "open-sans-bold", fontWeight: "600", fontSize: 14, color: "#323941" }}>
              Save
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        animationType={"slide"}
        style={{ backgroundColor: "white", height: Dimensions.get("window").height }}>
        {this.renderHeader()}
        <ScrollView style={{ padding: 20 }}>
          <GearReviewFormTitle />
          <GearReviewFormReview />
          <GearReviewFormImageCarousel />
          <GearReviewFormStarRating />
          <GearReviewFormProsCons />
        </ScrollView>
      </Modal>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GearReviewForm)
