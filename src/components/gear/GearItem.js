import React from "react"
import { StyleSheet, View, Text, Image, TouchableWithoutFeedback } from "react-native"

const GearItem = props => {
  return (
    <TouchableWithoutFeedback>
      <View>
        <View>
          <Image style={{ width: 380, height: 200 }} source={{ uri: props.productImageUrl }} />
        </View>
        <View>
          <Text>{props.title}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default GearItem
