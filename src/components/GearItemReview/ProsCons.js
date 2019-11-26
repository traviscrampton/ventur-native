import React, { Component } from "react"
import { View, Text, StyleSheet } from "react-native"

const renderItems = items => {
  return items.map((item, index) => {
    return <ProCon {...item} />
  })
}

const ProCon = item => {
  return (
    <View style={styles.proConContainer} key={item.id}>
      <Text style={styles.marginRight5}>{`${"\u2022"}`}</Text>
      <Text>{item.text}</Text>
    </View>
  )
}

export const ProsCons = props => {
  const { pros, cons } = props

  return (
    <View style={styles.marginTop10}>
      <View style={styles.topAndBottomMargin5}>
        <Text style={styles.labels}>Pros</Text>
        {renderItems(pros)}
      </View>
      <View style={styles.topAndBottomMargin5}>
        <Text style={styles.labels}>Cons</Text>
        {renderItems(cons)}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  proConContainer: {
    paddingLeft: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  labels: {
    fontSize: 18,
    marginBottom: 5,
    color: "#323941",
    fontFamily: "playfair"
  },
  marginRight5: {
    marginRight: 5
  },
  topAndBottomMargin5: {
    marginTop: 5,
    marginBottom: 5
  },
  marginTop10: {
    marginTop: 10
  }
})
