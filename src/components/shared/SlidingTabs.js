import React, { Component } from "react"
import Swiper from "react-native-swiper"
import { View, TouchableWithoutFeedback, Text, Animated } from "react-native"

export default class SlidingTabs extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tabBarAnimated: new Animated.ValueXY({ x: 0, y: 0 })
    }
  }

  handleTabPress = newIndex => {
    const { activeIndex } = this.props
    if (newIndex === activeIndex) return

    const delta = newIndex - activeIndex

    distance = this.calculateMoveableDistance(newIndex, delta)
    this.moveTabBar(distance)
    this.refs.swiper.scrollBy(delta)
  }

  handleIndexChange = newIndex => {
    const { activeIndex } = this.props
    if (newIndex === activeIndex) return

    const delta = newIndex - activeIndex
    distance = this.calculateMoveableDistance(newIndex, delta)
    this.moveTabBar(distance)
    this.props.onIndexChange(newIndex)
  }

  calculateMoveableDistance = (newIndex, delta) => {
    if (newIndex === 0) {
      return 0
    }

    return this.props.tabWidth * delta
  }

  moveTabBar = distance => {
    Animated.timing(
      this.state.tabBarAnimated,
      {
        toValue: { x: distance, y: 0 },
        duration: 200
      }
    ).start()
  }

  renderTabs() {
    const { tabWidth } = this.props
    return (
      <View style={{ paddingRight: 20, paddingLeft: 20 }}>
        <View style={{ display: "flex", flexDirection: "row" }}>
          {this.props.tabs.map((tab, index) => {
            return (
              <Tab
                {...tab}
                tabWidth={tabWidth}
                handleTabPress={() => this.handleTabPress(index)}
                isActiveIndex={this.props.activeIndex === index}
              />
            )
          })}
        </View>
        <Animated.View
          style={[{ backgroundColor: this.props.tabBarColor, height: 4, borderRadius: 5, width: tabWidth }, this.state.tabBarAnimated.getLayout()]}
        />
      </View>
    )
  }

  renderViews = () => {
    return this.props.tabs.map(tab => {
      return tab.view
    })
  }

  render() {
    return (
      <View>
        {this.renderTabs()}
        <Swiper
          ref="swiper"
          scrollEventThrottle={0}
          showsPagination={false}
          onIndexChanged={index => this.handleIndexChange(index)}
          loop={false}
          index={this.props.activeIndex}>
          {this.renderViews()}
        </Swiper>
      </View>
    )
  }
}

const Tab = props => {
  return (
    <TouchableWithoutFeedback key={props.label} onPress={props.handleTabPress}>
      <View
        style={{
          width: props.tabWidth,
          height: 45,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}>
        <Text style={{ color: "black" }}>{props.label}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}
