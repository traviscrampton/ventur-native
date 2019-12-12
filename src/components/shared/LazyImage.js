import React, { Component } from "react";
import { View } from "react-native";
import ProgressiveImage from "./ProgressiveImage";

class LazyImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadImage: false,
      loaded: false
    };
  }

  handleOnloadEnd = () => {
    this.setState({ loaded: true });
  };

  canRenderImage() {
    if (this.state.loaded) {
      return true;
    }

    const { yPosition, scrollPosition } = this.props;

    if (yPosition === 0) {
      return true;
    }

    return yPosition && scrollPosition > yPosition - 700;
  }

  render() {
    const { uri, style, thumbnailSource } = this.props;

    if (this.canRenderImage()) {
      return (
        <ProgressiveImage
          thumbnailSource={thumbnailSource}
          source={uri}
          style={style}
          onLoadEnd={this.handleOnloadEnd}
        />
      );
    } else {
      return <View style={[{ backgroundColor: "#e1e4e8" }, style]} />;
    }
  }
}

export default LazyImage;
