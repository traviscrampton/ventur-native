import React, { Component } from "react"
import { ScrollView, View, Text, TextInput, Image, TouchableWithoutFeedback } from "react-native"
import { updateGearReviewFormTitle, searchForGearItems } from "../../actions/gear_review_form"
import { connect } from "react-redux"

const mapStateToProps = state => ({
  width: state.common.width,
  name: state.gearReviewForm.name,
  gearItemSuggestions: state.gearReviewForm.gearItemSuggestions
})

const mapDispatchToProps = dispatch => ({
  updateGearReviewFormTitle: payload => dispatch(updateGearReviewFormTitle(payload)),
  searchForGearItems: payload => dispatch(searchForGearItems(payload))
})

class GearReviewFormTitle extends Component {
  constructor(props) {
    super(props)
  }

  renderGearItemSuggestions() {
    return this.props.gearItemSuggestions.map((gearItem, index) => {
      return (
        <View style={{ display: "flex", backgroundColor: "white", flexDirection: "row", alignItems: "center" }}>
          <Image style={{ width: 50, height: 50, marginRight: 20 }} source={{ uri: gearItem.imageUrl }} />
          <View style={{ backgroundColor: "white" }}>
            <Text>{gearItem.name}</Text>
          </View>
        </View>
      )
    })
  }

  renderGearDropdown() {
    if (this.props.gearItemSuggestions.length === 0) return

    return (
      <View
        style={{
          width: this.props.width - 40,
          top: 65,
          position: "absolute",
          backgroundColor: "white",
          borderWidth: 1,
          borderRadius: 5,
          borderColor: "#d3d3d3"
        }}>
        {this.renderGearItemSuggestions()}
      </View>
    )
  }

  updateGearReviewFormTitle = text => {
    this.props.updateGearReviewFormTitle(text)
    this.props.searchForGearItems(text)
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
          onChangeText={text => this.updateGearReviewFormTitle(text)}
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
