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

  getTitleAndCta = isPro => {
    const title = isPro ? "Pros" : "Cons"
    const addCta = `+ Add ${title.substring(0, 3)}
    `
    return Object.assign({}, { title, addCta })
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

  renderProsConsContainer(listItems, isPro) {
    const { title, addCta } = this.getTitleAndCta(isPro)

    return (
      <View style={{ marginBottom: 5 }}>
        <Text style={{ fontFamily: "open-sans-bold", fontSize: 18 }}>{title}</Text>
        {this.renderProsCons(listItems, isPro)}
        <TouchableWithoutFeedback onPress={() => this.addGearReviewFormProCon(isPro)}>
          <View>
            <Text>{addCta}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  render() {
    const { pros, cons } = this.props

    return (
      <View style={{ marginTop: 10 }}>
        {this.renderProsConsContainer(pros, true)}
        {this.renderProsConsContainer(cons, false)}
      </View>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GearReviewFormProsCons)
