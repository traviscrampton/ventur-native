import React from "react"
import { StyleSheet, View, Dimensions, Text, Image, Button, TouchableWithoutFeedback } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"

const StarRating = props => {
  const { rating, size } = props
  return (
    <View style={{ display: "flex", flexDirection: "row" }}>
      {[...Array(rating)].map((e, i) => {
        return <MaterialIcons name="star" color="gold" size={size} key={i} />
      })}
    </View>
  )
}

export default StarRating
