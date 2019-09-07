import React, { Component } from "react"
import { ScrollView, View, Text, TextInput, Image, TouchableWithoutFeedback } from "react-native"
import {
  updateGearReviewFormTitle,
  searchForGearItems,
  populateFormWithGearItem,
  toggleDropdown
} from "../../actions/gear_review_form"
import { MaterialIcons } from "@expo/vector-icons"
import { connect } from "react-redux"

const mapStateToProps = state => ({
  width: state.common.width,
  name: state.gearReviewForm.name,
  dropdownOpen: state.gearReviewForm.dropdownOpen,
  gearItemSuggestions: state.gearReviewForm.gearItemSuggestions,
  gearItem: state.gearReviewForm.gearItem
})

const mapDispatchToProps = dispatch => ({
  updateGearReviewFormTitle: payload => dispatch(updateGearReviewFormTitle(payload)),
  populateFormWithGearItem: payload => dispatch(populateFormWithGearItem(payload)),
  toggleDropdown: payload => dispatch(toggleDropdown(payload)),
  searchForGearItems: payload => dispatch(searchForGearItems(payload))
})

class GearReviewFormTitle extends Component {
  constructor(props) {
    super(props)
  }

  populateFormWithGearItem(gearItem) {
    this.props.toggleDropdown(false)
    this.props.populateFormWithGearItem(gearItem)
  }

  renderGearItemSuggestions() {
    let width = this.props.width - 110

    return this.props.gearItemSuggestions.map((gearItem, index) => {
      return (
        <React.Fragment>
          <TouchableWithoutFeedback onPressIn={() => this.populateFormWithGearItem(gearItem)}>
            <View
              style={{
                padding: 10,
                display: "flex",
                backgroundColor: "white",
                flexDirection: "row",
                alignItems: "center",
                width: width
              }}>
              <Image style={{ width: 50, height: 50, marginRight: 20 }} source={{ uri: gearItem.imageUrl }} />
              <View style={{ backgroundColor: "white" }}>
                <Text>{gearItem.name}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <View style={{ borderWidth: 1, borderColor: "#d3d3d3" }} />
        </React.Fragment>
      )
    })
  }

  renderGearDropdown() {
    if (!this.props.dropdownOpen) return
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
          borderColor: "#d3d3d3",
          borderBottomWidth: 0
        }}>
        {this.renderGearItemSuggestions()}
      </View>
    )
  }

  updateGearReviewFormTitle = text => {
    this.props.toggleDropdown(true)
    this.props.updateGearReviewFormTitle(text)
    this.props.searchForGearItems(text)
  }

  renderVerifiedIcon() {
    if (!this.props.gearItem.id) return

    return <MaterialIcons style={{ marginLeft: 10 }} color="#3F88C5" name="verified-user" size={16} />
  }

  render() {
    return (
      <View style={{ position: "relative", zIndex: 11 }}>
        <View style={{ marginBottom: 5, display: "flex", flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontFamily: "open-sans-bold", fontSize: 18 }}>Name</Text>
          {this.renderVerifiedIcon()}
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
