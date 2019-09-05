import React, { Component } from "react"
import { ScrollView, TextInput, View, Modal, Dimensions, Text, FlatList, TouchableWithoutFeedback } from "react-native"
import { connect } from "react-redux"
import { MaterialIcons } from "@expo/vector-icons"
import {
  updateGearReviewFormProCon,
  removeGearReviewFormProCon,
  addGearReviewFormProCon
} from "../../actions/gear_review_form"

const mapStateToProps = state => ({
  width: state.common.width,
  pros: state.gearReviewForm.pros,
  cons: state.gearReviewForm.cons
})

const mapDispatchToProps = dispatch => ({
  updateGearReviewFormProCon: payload => dispatch(updateGearReviewFormProCon(payload)),
  removeGearReviewFormProCon: payload => dispatch(removeGearReviewFormProCon(payload)),
  addGearReviewFormProCon: payload => dispatch(addGearReviewFormProCon(payload))
})

class GearReviewFormProsCons extends Component {
  constructor(props) {
    super(props)
  }

  addGearReviewFormProCon = isPro => {
    this.props.addGearReviewFormProCon(isPro)
  }

  updateProCon = (text, index, isPro) => {
    const payload = Object.assign({}, { text, index, isPro })

    this.props.updateGearReviewFormProCon(payload)
  }

  handleProConDelete = (index, isPro) => {
    const payload = Object.assign({}, { index, isPro })

    this.props.removeGearReviewFormProCon(payload)
  }

  renderProsCons = (prosCons, isPro) => {
    return prosCons.map((proCon, index) => {
      return (
        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <TextInput
            style={{
              marginTop: 5,
              marginBottom: 5,
              fontSize: 16,
              flexGrow: 1,
              borderWidth: 1,
              fontFamily: "open-sans-regular",
              padding: 5,
              borderRadius: 5,
              borderColor: "#d3d3d3"
            }}
            selectionColor="#FF5423"
            onChangeText={text => this.updateProCon(text, index, isPro)}
            value={proCon.text}
          />
          <TouchableWithoutFeedback onPress={() => this.handleProConDelete(index, isPro)}>
            <MaterialIcons name="delete" size={20} style={{ width: 40, textAlign: "right" }} />
          </TouchableWithoutFeedback>
        </View>
      )
    })
  }

  render() {
    const { pros, cons } = this.props

    return (
      <View style={{ marginTop: 10 }}>
        <View style={{ marginBottom: 5 }}>
          <Text style={{ fontFamily: "open-sans-bold", fontSize: 18 }}>Pros</Text>
          {this.renderProsCons(pros, true)}
          <TouchableWithoutFeedback onPress={() => this.addGearReviewFormProCon(true)}>
            <View>
              <Text>+ Add Pro</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={{ marginBottom: 5 }}>
          <Text style={{ fontFamily: "open-sans-bold", fontSize: 18 }}>Cons</Text>
          {this.renderProsCons(cons, false)}
          <TouchableWithoutFeedback onPress={() => this.addGearReviewFormProCon(false)}>
            <View>
              <Text>+ Add Con</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GearReviewFormProsCons)
