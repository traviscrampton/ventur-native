import React, { Component } from "react"
import { View, Text } from "react-native"

const renderItems = items => {
  return items.map((item, index) => {
    return <ProCon {...item} />
  })
}

const ProCon = item => {
  return (
    <View style={{ paddingLeft: 5, display: "flex", flexDirection: "row", alignItems: "center" }} key={item.id}>
      <Text style={{ marginRight: 5 }}>{`${"\u2022"}`}</Text>
      <Text>{item.text}</Text>
    </View>
  )
}

export const ProsCons = props => {
  const { pros, cons } = props

  return (
    <View style={{ marginTop: 10 }}>
      <View style={{ marginTop: 5, marginBottom: 5 }}>
        <Text style={{ fontSize: 18, marginBottom: 5, color: "#323941", fontFamily: "playfair" }}>Pros</Text>
        {renderItems(pros)}
      </View>
      <View style={{ marginTop: 5, marginBottom: 5 }}>
        <Text style={{ fontSize: 18, marginBottom: 5, color: "#323941", fontFamily: "playfair" }}>Cons</Text>
        {renderItems(cons)}
      </View>
    </View>
  )
}
