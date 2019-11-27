import React, { Component } from "react"
import { View, Text, TextInput, Image, TouchableWithoutFeedback, StyleSheet } from "react-native"
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

  handleOnBlur = () => {
    this.props.toggleDropdown(false)
  }

  renderGearItemSuggestions() {
    let width = this.props.width - 110
    let borderBottom = <View style={styles.borderBottom} />

    return this.props.gearItemSuggestions.map((gearItem, index) => {
      if (this.props.gearItemSuggestions.length - 1 === index) {
        borderBottom = <View />
      }

      return (
        <React.Fragment>
          <TouchableWithoutFeedback onPressIn={() => this.populateFormWithGearItem(gearItem)}>
            <View style={[styles.gearImageContainer, { width }]}>
              <Image style={styles.imageSizing} source={{ uri: gearItem.imageUrl }} />
              <View style={styles.backgroundWhite}>
                <Text>{gearItem.name}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
          {borderBottom}
        </React.Fragment>
      )
    })
  }

  renderGearDropdown() {
    if (!this.props.dropdownOpen) return
    if (this.props.gearItemSuggestions.length === 0) return

    return (
      <View
        shadowColor="gray"
        shadowOffset={{ width: 0, height: 0 }}
        shadowOpacity={0.5}
        shadowRadius={2}
        style={[
          styles.gearDropdownContainer,
          {
            width: this.props.width - 40
          }
        ]}>
        <View style={styles.gearItemSuggestions}>{this.renderGearItemSuggestions()}</View>
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

    return <MaterialIcons style={styles.marginLeft10} color="#3F88C5" name="verified-user" size={16} />
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.nameAndIcon}>
          <Text style={styles.nameText}>Name</Text>
          {this.renderVerifiedIcon()}
        </View>
        <TextInput
          onBlur={this.handleOnBlur}
          shadowColor="gray"
          shadowOffset={{ width: 0, height: 0 }}
          shadowOpacity={0.5}
          shadowRadius={2}
          style={styles.textInput}
          selectionColor="#FF5423"
          onChangeText={text => this.updateGearReviewFormTitle(text)}
          value={this.props.name}
        />
        {this.renderGearDropdown()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  nameText: {
    fontFamily: "playfair",
    color: "#323941",
    fontSize: 18
  },
  nameAndIcon: {
    marginBottom: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  textInput: {
    backgroundColor: "white",
    fontSize: 18,
    borderWidth: 1,
    fontFamily: "open-sans-regular",
    padding: 5,
    borderRadius: 5,
    borderColor: "#d3d3d3"
  },
  container: {
    position: "relative",
    zIndex: 11
  },
  borderBottom: {
    borderWidth: 1,
    borderColor: "#d3d3d3"
  },
  gearImageContainer: {
    padding: 10,
    display: "flex",
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center"
  },
  gearItemSuggestions: {
    overflow: "hidden",
    borderRadius: 5
  },
  gearDropdownContainer: {
    top: 65,
    position: "absolute",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#d3d3d3",
    borderRadius: 5
  },
  marginLeft10: {
    marginLeft: 10
  },
  imageSizing: {
    width: 50,
    height: 50,
    marginRight: 20
  },
  backgroundWhite: {
    backgroundColor: "white"
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GearReviewFormTitle)
