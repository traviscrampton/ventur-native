import React, { Component } from "react"
import {
  ScrollView,
  View,
  Modal,
  SafeAreaView,
  Dimensions,
  Text,
  TextInput,
  TouchableWithoutFeedback
} from "react-native"
import { connect } from "react-redux"
import { persistGearReview } from "../../actions/gear_review_form"
import InputScrollView from "react-native-input-scroll-view"
import GearReviewFormTitle from "./GearReviewFormTitle"
import GearReviewFormStarRating from "./GearReviewFormStarRating"
import GearReviewFormImageCarousel from "./GearReviewFormImageCarousel"
import GearReviewFormProsCons from "./GearReviewFormProsCons"
import GearReviewFormReview from "./GearReviewFormReview"
import FormModal from "../shared/FormModal"

const mapStateToProps = state => ({
  visible: state.gearReviewForm.visible,
  width: state.common.width,
  height: state.common.height
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
            <Text style={{ fontFamily: "playfair", fontSize: 14, color: "#323941" }}>Cancel</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.persistGearReview}>
          <View>
            <Text style={{ fontFamily: "playfair", fontSize: 14, color: "#323941" }}>Save</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  render() {
    return (
      <FormModal
        visible={this.props.visible}
        animationType={"slide"}
        style={{ backgroundColor: "white", height: this.props.height }}>
          {this.renderHeader()}
          <InputScrollView style={{ padding: 20 }}>
            <GearReviewFormTitle />
            <GearReviewFormReview />
            <GearReviewFormImageCarousel />
            <GearReviewFormStarRating />
            <GearReviewFormProsCons />
            <View style={{ marginBottom: 200 }} />
          </InputScrollView>
      </FormModal>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GearReviewForm)
