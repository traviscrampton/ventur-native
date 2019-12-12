import React, { Component } from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback
} from "react-native";
import {
  toggleImageSliderModal,
  populateImages
} from "../../actions/image_slider";
import { loadRouteEditor } from "../../actions/route_editor";
import { loadRouteViewer } from "../../actions/route_viewer";
import ChapterMetaDataForm from "../editor/ChapterMetaDataForm";
import CommentsContainer from "../Comments/CommentsContainer";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Feather
} from "@expo/vector-icons";
import ProgressiveImage from "../shared/ProgressiveImage";
import LazyImage from "../shared/LazyImage";
import ImageSlider from "../shared/ImageSlider";

const mapStateToProps = state => ({
  chapter: state.chapter.chapter,
  user: state.chapter.chapter.user,
  currentUser: state.common.currentUser,
  width: state.common.width,
  height: state.common.height
});

const mapDispatchToProps = dispatch => ({
  loadRouteEditor: payload => dispatch(loadRouteEditor(payload)),
  loadRouteViewer: payload => dispatch(loadRouteViewer(payload)),
  toggleImageSliderModal: payload => dispatch(toggleImageSliderModal(payload)),
  populateImages: payload => dispatch(populateImages(payload))
});

class ChapterShow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollPosition: 0,
      imageYPositions: {}
    };
  }

  handleScroll = event => {
    this.setState({ scrollPosition: event.nativeEvent.contentOffset.y });
  };

  renderPublishedText() {
    if (this.props.currentUser.id != this.props.chapter.user.id) return;

    if (this.props.chapter.published) {
      return (
        <View style={styles.flexRowCenter}>
          <MaterialIcons
            style={styles.iconPosition}
            size={16}
            name={"done"}
            color={"#3F88C5"}
          />
          <Text style={[styles.publishedStyle, { color: "#3F88C5" }]}>
            PUBLISHED
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.flexRowCenter}>
          <MaterialIcons
            style={styles.iconPosition}
            size={16}
            name={"publish"}
            color={"#FF5423"}
          />
          <Text style={[styles.publishedStyle, { color: "#FF5423" }]}>
            UNPUBLISHED
          </Text>
        </View>
      );
    }
  }

  renderTitle() {
    const { title } = this.props.chapter;
    return (
      <View style={styles.titleDescriptionContainer}>
        <View
          style={[
            styles.flexColumn,
            { marginTop: this.props.chapter.imageUrl ? 0 : 20 }
          ]}
        >
          <Text style={styles.title}>{title}</Text>
          {this.renderPublishedText()}
        </View>
      </View>
    );
  }

  returnDistanceString(distance) {
    const {
      distanceType,
      kilometerAmount,
      mileAmount,
      readableDistanceType
    } = distance;
    switch (distanceType) {
      case "kilometer":
        return `${kilometerAmount} ${readableDistanceType}`;

      case "mile":
        return `${mileAmount} ${readableDistanceType}`;

      default:
        return "";
    }
  }

  prepareSliderImages() {
    return this.props.chapter.editorBlob.content
      .filter((entry, index) => {
        return entry.type === "image";
      })
      .map((entry, index) => {
        return Object.assign(
          {},
          {
            uri: entry.uri,
            caption: entry.caption,
            height: this.getImageHeight(entry.aspectRatio)
          }
        );
      });
  }

  openImageSlider = entry => {
    const images = this.prepareSliderImages();
    const activeIndex = images.findIndex(image => {
      return image.uri === entry.uri;
    });
    const payload = Object.assign({}, { images, activeIndex });

    this.props.populateImages(payload);
    this.props.toggleImageSliderModal(true);
  };

  navigateToMap = async () => {
    const { cycleRouteId } = this.props.chapter;

    if (this.props.currentUser.id == this.props.chapter.user.id) {
      this.props.loadRouteEditor(cycleRouteId);
      this.props.navigation.navigate("RouteEditor");
    } else {
      this.props.loadRouteViewer(cycleRouteId);
      this.props.navigation.navigate("RouteViewer");
    }
  };

  renderMapIconCta() {
    return (
      <TouchableWithoutFeedback onPress={this.navigateToMap}>
        <View style={styles.flexRowCenter}>
          <View style={{ paddingRight: 10 }}>
            <Feather name="map" size={25} color="#323941" />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderMapIconWithImage() {
    if (!this.props.chapter.imageUrl) return;

    return this.renderMapIconCta();
  }

  renderStatistics() {
    const { readableDate, distance } = this.props.chapter;
    const distanceString = this.returnDistanceString(distance);
    return (
      <View style={styles.statisticsPadding}>
        <View style={styles.statisticsContainer}>
          <MaterialCommunityIcons
            name="calendar"
            size={18}
            style={styles.iconPosition}
          />
          <Text style={styles.statisticsText}>
            {`${readableDate}`.toUpperCase()}
          </Text>
        </View>
        <View style={styles.statisticsContainer}>
          <MaterialIcons
            style={styles.iconPosition}
            name="directions-bike"
            size={16}
          />
          <Text style={styles.statisticsText}>
            {`${distanceString}`.toUpperCase()}
          </Text>
        </View>
      </View>
    );
  }

  renderChapterImage() {
    let fourthWindowWidth = this.props.width / 2.5;
    const { imageUrl, thumbnailSource } = this.props.chapter;
    if (!imageUrl) return;
    return (
      <View
        style={{
          height: fourthWindowWidth,
          width: this.props.width,
          marginBottom: 10
        }}
      >
        <ProgressiveImage
          source={imageUrl}
          thumbnailSource={thumbnailSource}
          style={{
            width: this.props.width,
            height: fourthWindowWidth,
            borderRadius: 0,
            marginBottom: 20
          }}
        />
      </View>
    );
  }

  renderDivider() {
    return <View style={styles.dividerStyles} />;
  }

  getInputStyling(entry) {
    switch (entry.styles) {
      case "H1":
        return {
          fontFamily: "playfair",
          fontSize: 22
        };
      case "QUOTE":
        return {
          fontStyle: "italic",
          borderLeftWidth: 5,
          paddingTop: 10,
          paddingBottom: 10
        };
      default:
        return {};
    }
  }

  renderImageCaption(entry) {
    if (entry.caption.length === 0) return;

    return (
      <View style={styles.paddingRightLeft}>
        <Text style={styles.textAlignCenter}>{entry.caption}</Text>
      </View>
    );
  }

  getImageHeight(aspectRatio) {
    return aspectRatio * this.props.width;
  }

  getThumbnailSource(entry) {
    if (entry.thumbnailSource) {
      return entry.thumbnailSource;
    } else {
      return "";
    }
  }

  handleLayout(e, index) {
    const { y } = e.nativeEvent.layout;
    this.setState({
      imageYPositions: Object.assign({}, this.state.imageYPositions, {
        [index]: y
      })
    });
  }

  getYPosition(index) {
    if (index === 0) {
      return 0;
    }

    return this.state.imageYPositions[index]
      ? this.state.imageYPositions[index]
      : false;
  }

  renderImageEntry(entry, index) {
    const height = this.getImageHeight(entry.aspectRatio);

    return (
      <View
        onLayout={e => this.handleLayout(e, index)}
        key={`image${index}`}
        yPosition={this.state.imageYPositions[index]}
        style={styles.imageEntryStyle}
      >
        <TouchableWithoutFeedback onPress={() => this.openImageSlider(entry)}>
          <View style={{ height }}>
            <LazyImage
              style={{ width: this.props.width, height }}
              yPosition={this.getYPosition(index)}
              scrollPosition={this.state.scrollPosition}
              thumbnailSource={entry.thumbnailUri}
              uri={entry.uri}
            />
          </View>
        </TouchableWithoutFeedback>
        {this.renderImageCaption(entry)}
      </View>
    );
  }

  renderTextEntry(entry, index) {
    return (
      <View
        style={{
          padding: 20
        }}
      >
        <Text
          multiline
          key={index}
          style={[styles.textEntryText, this.getInputStyling(entry)]}
        >
          {entry.content}
        </Text>
      </View>
    );
  }

  renderEntry = (entry, index) => {
    switch (entry.type) {
      case "text":
        return this.renderTextEntry(entry, index);
      case "image":
        return this.renderImageEntry(entry, index);
      default:
        console.log("WHAT IS IT", entry);
    }
  };

  renderBodyContent() {
    if (!this.props.chapter.editorBlob.content) return;

    let entries = this.props.chapter.editorBlob.content;
    if (!Array.isArray(entries)) {
      entries = Array.from(entries);
    }

    return entries.map((entry, index) => {
      return this.renderEntry(entry, index);
    });
  }

  renderIconAndThreeDotMenu() {
    return <View style={styles.threeDotMenu}>{this.renderMapIconCta()}</View>;
  }

  renderCommentContainer() {
    let commentableProps = Object.assign(
      {},
      {
        commentableId: this.props.chapter.id,
        commentableType: "chapter",
        commentableUser: this.props.chapter.user,
        commentableTitle: this.props.chapter.title,
        commentCount: this.props.chapter.commentCount,
        navigation: this.props.navigation
      }
    );
    return <CommentsContainer {...commentableProps} />;
  }

  render() {
    return (
      <ScrollView
        style={[styles.container, { minHeight: this.props.height }]}
        scrollEventThrottle={100}
        onScroll={event => this.handleScroll(event)}
      >
        <View style={styles.flexRowSpaceBetween}>
          {this.renderChapterImage()}
          {this.renderMapIconWithImage()}
        </View>
        {this.renderTitle()}
        {this.renderStatistics()}
        {this.renderIconAndThreeDotMenu()}
        {this.renderDivider()}
        <View style={styles.bodyContainer}>{this.renderBodyContent()}</View>
        <View style={styles.marginBottom200}>
          {this.renderCommentContainer()}
        </View>
        <ChapterMetaDataForm />
        <ImageSlider />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginBottom: 100
  },
  textEntryText: {
    fontSize: 20,
    fontFamily: "open-sans-regular"
  },
  flexRowSpaceBetween: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  bodyContainer: {
    marginBottom: 100,
    minHeight: 200,
    position: "relative",
    zIndex: 0
  },
  paddingRightLeft: {
    paddingLeft: 20,
    paddingRight: 20
  },
  marginBottom200: {
    marginBottom: 200
  },
  dividerStyles: {
    borderBottomWidth: 3,
    borderBottomColor: "#323941",
    width: 90,
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 30
  },
  flexRowCenter: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  publishedStyle: {
    padding: 2,
    alignSelf: "flex-start",
    borderRadius: 5
  },
  flexColumn: {
    display: "flex",
    flexDirection: "column"
  },
  titleDescriptionContainer: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 10
  },
  title: {
    fontSize: 28,
    fontFamily: "playfair",
    color: "#323941"
  },
  description: {
    fontSize: 18,
    color: "#c3c3c3",
    fontFamily: "open-sans-semi"
  },
  imageEntryStyle: {
    position: "relative",
    marginBottom: 20
  },
  statisticsContainer: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 5
  },
  threeDotMenu: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 20,
    paddingLeft: 20,
    marginBottom: 5,
    position: "relative",
    zIndex: 100
  },
  iconPosition: {
    marginRight: 5
  },
  textAlignCenter: {
    textAlign: "center"
  },
  statisticsPadding: {
    padding: 20,
    paddingTop: 0
  },
  statisticsText: {
    fontFamily: "overpass",
    fontSize: 14
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChapterShow);
