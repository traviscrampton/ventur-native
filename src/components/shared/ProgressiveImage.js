import React, { Component } from "react";
import { View, StyleSheet, Animated } from "react-native";

const styles = StyleSheet.create({
  imageOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  },
  container: {
    backgroundColor: "#e1e4e8",
    position: "relative",
    borderRadius: 0
  }
});

class ProgressiveImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      thumbnailAnimated: new Animated.Value(0),
      imageAnimated: new Animated.Value(0)
    };
  }

  handleThumbnailLoad = () => {
    Animated.timing(this.state.thumbnailAnimated, {
      toValue: 1
    }).start();
  };

  onImageLoad = () => {
    Animated.timing(this.state.imageAnimated, {
      toValue: 1
    }).start();
  };

  handleOnloadEnd = () => {
    if (this.props.onLoadEnd) {
      this.props.onLoadEnd();
    }
  };

  render() {
    const { thumbnailSource, source, style, ...props } = this.props;

    return (
      <View style={styles.container}>
        <Animated.Image
          {...props}
          source={{ uri: thumbnailSource }}
          style={[
            styles.imageOverlay,
            { opacity: this.state.thumbnailAnimated }
          ]}
          onLoad={this.handleThumbnailLoad}
          blurRadius={1}
        />
        <Animated.Image
          {...props}
          source={{ uri: source }}
          style={[
            styles.imageOverlay,
            { opacity: this.state.imageAnimated },
            style
          ]}
          onLoad={this.onImageLoad}
          onLoadEnd={this.handleOnloadEnd}
        />
      </View>
    );
  }
}

export default ProgressiveImage;
