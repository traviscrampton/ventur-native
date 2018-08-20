import React from "react"
import { StyleSheet, View, Text, ImageBackground, Image, TouchableWithoutFeedback, Dimensions } from "react-native"

const pad = Dimensions.get("window").width * 0.04
const imageGaps = Dimensions.get("window").width * 0.11
const imageWidth = (Dimensions.get("window").width - imageGaps) / 2
const imageHeight = Math.round(imageWidth * (240 / 350))
const JournalMini = props => {
  return (
    <ImageBackground
      style={{
        width: imageWidth,
        height: imageWidth,
        marginBottom: pad,
        position: "relative"
      }}
      imageStyle={{ borderRadius: 10 }}
      source={{ uri: props.miniBannerImageUrl }}>
      <TouchableWithoutFeedback onPress={() => props.handlePress(props.id)}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1
          }}>
          <Text style={{ color: "white", fontFamily: "playfair", marginBottom: 5 }}>{props.title}</Text>
          <Text style={{ color: "white", fontFamily: "overpass", fontSize: 8 }}>
            {`${props.status}`.toUpperCase()} {`\u2022`} {`${props.distance} miles`.toUpperCase()}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  )
}

export default JournalMini
