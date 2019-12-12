import React, { Component } from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableWithoutFeedback,
  Alert
} from "react-native";
import {
  fetchGearItem,
  deleteGearReview
} from "../../actions/gear_item_review";
import { editGearItemReview } from "../../actions/gear_review_form";
import { JournalChildHeader } from "../shared/JournalChildHeader";
import { MaterialIndicator } from "react-native-indicators";
import { ProsCons } from "./ProsCons";
import StarRating from "../shared/StarRating";
import ImageSlider from "../shared/ImageSlider";
import ProgressiveImage from "../shared/ProgressiveImage";
import {
  toggleImageSliderModal,
  populateImages
} from "../../actions/image_slider";

const mapStateToProps = state => ({
  width: state.common.width,
  id: state.gearItemReview.id,
  userId: state.gearItemReview.userId,
  loading: state.gearItemReview.loading,
  currentUser: state.common.currentUser,
  name: state.gearItemReview.name,
  review: state.gearItemReview.review,
  images: state.gearItemReview.images,
  gearImageUrl: state.gearItemReview.gearItem.imageUrl,
  rating: state.gearItemReview.rating,
  pros: state.gearItemReview.pros,
  cons: state.gearItemReview.cons,
  journalTitle: state.journal.journal.title
});

const mapDispatchToProps = dispatch => ({
  fetchGearItem: payload => dispatch(fetchGearItem(payload)),
  toggleImageSliderModal: payload => dispatch(toggleImageSliderModal(payload)),
  populateImages: payload => dispatch(populateImages(payload)),
  editGearItemReview: payload => dispatch(editGearItemReview(payload)),
  deleteGearReview: payload => dispatch(deleteGearReview(payload))
});

class GearItemReview extends Component {
  constructor(props) {
    super(props);
  }

  static MAX_STARS = 5;

  componentWillMount() {
    this.props.fetchGearItem(this.props.id);
  }

  getStarText() {
    switch (this.props.rating) {
      case 1:
        return "Bad";
      case 2:
        return "Meh";
      case 3:
        return "Decent";
      case 4:
        return "Pretty Good";
      case 5:
        return "Excellent";
      default:
        return "";
    }
  }

  navigateBack = () => {
    this.props.navigation.goBack();
  };

  getCarouselImages() {
    return [
      { largeUri: this.props.gearImageUrl, thumbnailUri: null },
      ...this.props.images
        .map(image => {
          if (this.props.gearImageUrl !== image.originalUri) {
            return image;
          }
        })
        .filter(image => {
          return image;
        })
    ];
  }

  isCurrentUser = () => {
    return this.props.userId == this.props.currentUser.id;
  };

  editGearReview = () => {
    this.props.editGearItemReview();
  };

  handleDelete = () => {
    this.props.deleteGearReview();
    this.navigateBack();
  };

  deleteGearReview = () => {
    Alert.alert(
      "Are you sure?",
      "Deleting this gear review will erase all images and content",
      [
        { text: "Delete Gear Review", onPress: this.handleDelete },
        { text: "Cancel", style: "cancel" }
      ],
      { cancelable: true }
    );
  };

  getOptions = isCurrentUser => {
    if (!isCurrentUser) return;

    return [
      { title: "Edit Gear Review", callback: this.editGearReview },
      { title: "Delete Gear Review", callback: this.deleteGearReview }
    ];
  };

  getDropdownProps = () => {
    const isCurrentUser = this.isCurrentUser();
    const options = this.getOptions(isCurrentUser);

    return Object.assign(
      {},
      {
        isCurrentUser,
        options
      }
    );
  };

  renderHeader = () => {
    const dropdownProps = this.getDropdownProps();

    return (
      <JournalChildHeader
        width={this.props.width}
        title={this.props.journalTitle}
        navigateBack={this.navigateBack}
        dropdownProps={dropdownProps}
      />
    );
  };

  renderName = () => {
    return (
      <View>
        <Text style={styles.name}>{this.props.name}</Text>
      </View>
    );
  };

  renderReview() {
    if (this.props.review.length === 0) return;

    return (
      <View style={styles.marginTop20}>
        <View style={styles.marginBottom5}>
          <Text style={styles.reviewLabel}>Review: </Text>
        </View>
        <Text style={styles.review}>{this.props.review}</Text>
      </View>
    );
  }

  renderRating() {
    const starText = this.getStarText();

    return (
      <View style={styles.ratingContainer}>
        <StarRating rating={this.props.rating} size={44} />
        <View style={styles.marginLeft10}>
          <Text style={styles.starText}>{starText}</Text>
        </View>
      </View>
    );
  }

  renderImageSlider = index => {
    const activeIndex = index;
    const images = this.getCarouselImages().map(image => {
      return Object.assign(
        {},
        { uri: image.largeUri, caption: "", height: this.props.width }
      );
    });

    const payload = Object.assign({}, { images, activeIndex });

    this.props.populateImages(payload);
    this.props.toggleImageSliderModal(true);
  };

  renderProsCons() {
    return <ProsCons pros={this.props.pros} cons={this.props.cons} />;
  }

  renderItem(item, index) {
    let { thumbnailUri, largeUri } = item;
    return (
      <TouchableWithoutFeedback onPress={() => this.renderImageSlider(index)}>
        <View style={styles.imageContainer}>
          <ProgressiveImage
            thumbnailSource={thumbnailUri}
            source={largeUri}
            style={styles.progressiveImageStyles}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderImageCarousel() {
    const carouselImages = this.getCarouselImages();
    if (carouselImages.length === 1 && carouselImages[0].largeUri.length === 0)
      return;

    return (
      <View style={styles.marginTop20}>
        <FlatList
          horizontal={true}
          data={carouselImages}
          renderItem={({ item, index }) => this.renderItem(item, index)}
        />
      </View>
    );
  }

  render() {
    if (this.props.loading) {
      return (
        <View style={[styles.loadingSpinner, { width: this.props.width }]}>
          <MaterialIndicator size={40} color="#FF5423" />
        </View>
      );
    }

    return (
      <SafeAreaView style={styles.backgroundColorWhite}>
        <View style={styles.headerContainer}>
          {this.renderHeader()}
          <ScrollView style={styles.scrollViewContainer}>
            {this.renderName()}
            {this.renderImageCarousel()}
            {this.renderReview()}
            {this.renderRating()}
            {this.renderProsCons()}
            <View style={styles.marginBottom200} />
          </ScrollView>
          <ImageSlider />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    marginTop: 10
  },
  marginBottom200: {
    marginBottom: 200
  },
  scrollViewContainer: {
    backgroundColor: "white",
    flex: 1,
    padding: 20
  },
  headerContainer: {
    height: "100%",
    backgroundColor: "white"
  },
  backgroundColorWhite: {
    backgroundColor: "white"
  },
  marginTop20: {
    marginTop: 20
  },
  loadingSpinner: {
    position: "absolute",
    height: "100%",
    backgroundColor: "white"
  },
  name: {
    fontFamily: "playfair",
    fontSize: 28,
    color: "#323941"
  },
  marginBottom5: {
    marginBottom: 5
  },
  progressiveImageStyles: {
    width: 120,
    height: 120,
    borderRadius: 5
  },
  reviewLabel: {
    fontSize: 18,
    color: "#323941",
    fontFamily: "playfair"
  },
  marginLeft10: {
    marginLeft: 10
  },
  starText: {
    color: "#323941",
    fontFamily: "open-sans-regular"
  },
  imageContainer: {
    marginRight: 2,
    width: 120,
    height: 120
  },
  ratingContainer: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  review: {
    fontSize: 16,
    color: "#323941",
    fontFamily: "open-sans-regular"
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GearItemReview);
