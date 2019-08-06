import React, { Component } from "react"
import { View, StyleSheet, Image } from "react-native"
import ProgressiveImage from "./ProgressiveImage"
import { connect } from "react-redux"

class LazyImage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loadImage: false,
      loaded: false
    }
  }

  handleOnloadEnd = () => {
    this.setState({ loaded: true})
  }

  canRenderImage() {
    if (this.state.loaded) {
      return true
    }

    const { yPosition, scrollPosition } = this.props

    return yPosition && scrollPosition > yPosition - 1000
  }

  render() {
    const { uri, style, yPosition, scrollPosition } = this.props

    if (this.canRenderImage()) {
      return <ProgressiveImage
          source={uri}
          style={style}
          onLoadEnd={this.handleOnloadEnd} />
    } else {
      return <View style={[{ backgroundColor: "#e1e4e8" }, style]} />
    }
  }
}

export default LazyImage
