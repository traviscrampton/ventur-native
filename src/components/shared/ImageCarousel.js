import React, { Component } from "react"
import { connect } from "react-redux"
import { StyleSheet, ScrollView, View, Text, Image, TouchableWithoutFeedback, TextInput } from "react-native"
import Carousel from "react-native-snap-carousel"

const mapStateToProps = state => ({
  width: state.common.width
})

const mapDispatchToProps = dispatch => ({})

class ImageCarousel extends Component {
  constructor(props) {
    super(props)
  }

  _renderItem = ({ item, index }) => {
    return (
      <View>
        <Image style={{ width: 200, height: 200, backgroundColor: 'green'}} source={{ uri: item }} />
      </View>
    )
  }

  render() {
    return (
        <Carousel
          layoutCardOffset={0}
          ref={c => {
            this._carousel = c
          }}
          data={this.props.images}
          layout={"default"}
          activeSlideAlignment={"start"}
          renderItem={this._renderItem}
          sliderWidth={250}
          sliderHeight={250}
          itemWidth={200}
          itemHeight={200}
          {...this.props.extraCarouselProps}
        />
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
)(ImageCarousel)
