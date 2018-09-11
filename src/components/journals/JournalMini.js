import React from "react"
import { StyleSheet, View, Text, ImageBackground, TouchableWithoutFeedback, Dimensions } from "react-native"

const pad = Dimensions.get("window").width * 0.04
const imageGaps = Dimensions.get("window").width * 0.11
const imageWidth = (Dimensions.get("window").width - imageGaps) / 2
const imageHeight = Math.round(imageWidth * (240 / 350))
const JournalMini = props => {
  return (
    <ImageBackground
      style={styles.imageBackground}
      imageStyle={styles.borderRadius}
      source={{ uri: props.miniBannerImageUrl }}>
      <TouchableWithoutFeedback onPress={() => props.handlePress(props.id)}>
        <View style={styles.metadataContainer}>
          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.metadata}>
            {`${props.status}`.toUpperCase()} {`\u2022`} {`${props.distance} miles`.toUpperCase()}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  imageBackground: {
    width: imageWidth,
    height: imageWidth,
    marginBottom: pad,
    position: "relative"
  },
  borderRadius: {
    borderRadius: 10
  },
  metadataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1
  },
  title: {
    color: "white",
    fontFamily: "playfair",
    marginBottom: 5
  },
  metadata: {
    color: "white",
    fontFamily: "overpass",
    fontSize: 8
  }
})

export default JournalMini
