import React, { Component } from "react"
import { connect } from "react-redux"
import { StyleSheet, ScrollView, View, Text, Image, TouchableWithoutFeedback, TextInput } from "react-native"
import { fetchGearItem } from "../../actions/gear_item_review"
import { JournalChildHeader } from "../shared/JournalChildHeader"
import ImageCarousel from "../shared/ImageCarousel"
import ProsCons from "./ProsCons"
import StarRating from "../shared/StarRating"

const mapStateToProps = state => ({
  width: state.common.width,
  id: state.gearItemReview.id,
  name: state.gearItemReview.name,
  review: state.gearItemReview.review,
  images: state.gearItemReview.images,
  gearImageUrl: state.gearItemReview.gearItem.imageUrl,
  rating: state.gearItemReview.rating,
  pros: state.gearItemReview.pros,
  cons: state.gearItemReview.cons,
  journalTitle: state.journal.journal.title
})

const mapDispatchToProps = dispatch => ({
  fetchGearItem: payload => dispatch(fetchGearItem(payload))
})

class GearItemReview extends Component {
  constructor(props) {
    super(props)
  }

  static MAX_STARS = 5

  componentWillMount() {
    this.props.fetchGearItem(this.props.id)
  }

  getStarText() {
    switch (this.props.rating) {
      case 1:
        return "Bad"
      case 2:
        return "Meh"
      case 3:
        return "Decent"
      case 4:
        return "Pretty Good"
      case 5:
        return "Excellent"
      default:
        return ""
    }
  }

  navigateBack = () => {
    this.props.navigation.goBack()
  }

  getCarouselImages() {
    return [
      this.props.gearImageUrl,
      ...this.props.images
        .map((image, index) => {
          if (this.props.gearImageUrl !== image.originalUri) {
            return image.thumbnailUri
          }
        })
        .filter((image, index) => {
          return image
        })
    ]
  }

  renderName = () => {
    return (
      <View>
        <Text style={{ fontFamily: "playfair", fontSize: 28, color: "#323941" }}>{this.props.name}</Text>
      </View>
    )
  }

  renderReview() {
    if (this.props.review.length === 0) return

    return (
      <View style={{ marginTop: 20 }}>
        <View style={{ marginBottom: 5 }}>
          <Text style={{ fontSize: 18, color: "#323941", fontFamily: "playfair" }}>Review: </Text>
        </View>
        <Text style={{ fontSize: 14, color: "#323941", fontFamily: "open-sans-regular" }}>{this.props.review}</Text>
      </View>
    )
  }

  renderRating() {
    const starText = this.getStarText()

    return (
      <View style={{ marginTop: 20, display: "flex", flexDirection: "row", alignItems: "center" }}>
        <StarRating rating={this.props.rating} size={44} />
        <View style={{ marginLeft: 10}}>
          <Text style={{color: "#323941", fontFamily: "open-sans-regular"}}>{starText}</Text>
        </View>
      </View>
    )
  }

  renderProsCons() {
    return <ProsCons pros={this.props.pros} cons={this.props.cons} />
  }

  renderImageCarousel() {
    const carouselImages = this.getCarouselImages()

    return (
      <View style={{ marginTop: 20 }}>
        <ImageCarousel images={carouselImages} />
      </View>
    )
  }

  render() {
    return (
      <View style={{ height: "100%", backgroundColor: "white" }}>
        <JournalChildHeader width={this.props.width} title={this.props.journalTitle} navigateBack={this.navigateBack} />
        <ScrollView style={{ backgroundColor: "white", flex: 1, padding: 20 }}>
          {this.renderName()}
          {this.renderReview()}
          {this.renderImageCarousel()}
          {this.renderRating()}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    marginTop: 10
  },
  formTitle: {},
  title: {}
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GearItemReview)
