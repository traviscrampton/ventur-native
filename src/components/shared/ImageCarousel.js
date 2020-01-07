import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Image } from 'react-native';
import Carousel from 'react-native-snap-carousel';

const mapStateToProps = state => ({
  width: state.common.width
});

class ImageCarousel extends Component {
  constructor(props) {
    super(props);
  }

  _renderItem = ({ item, index }) => {
    return (
      <View>
        <Image style={styles.dasImage} source={{ uri: item }} />
      </View>
    );
  };

  render() {
    return (
      <Carousel
        layoutCardOffset={0}
        ref={c => {
          this._carousel = c;
        }}
        data={this.props.images}
        layout={'default'}
        activeSlideAlignment={'start'}
        renderItem={this._renderItem}
        sliderWidth={250}
        sliderHeight={250}
        itemWidth={200}
        itemHeight={200}
        {...this.props.extraCarouselProps}
      />
    );
  }
}

const styles = StyleSheet.create({
  dasImage: {
    width: 200,
    height: 200,
    backgroundColor: 'green'
  },
  container: {
    padding: 25,
    marginTop: 10
  },
  formTitle: {},
  title: {}
});

export default connect(mapStateToProps, null)(ImageCarousel);
