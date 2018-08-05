import React, { Component } from "react"
import { StyleSheet, FlatList, View, Text, List, ScrollView } from "react-native"
import Markdown from "react-native-markdown-renderer"

const rules = {
  heading1: (node, children, parent, styles) => (
    <Text key={Math.floor(Math.random() * Math.floor(100000))} style={[styles.heading, styles.heading1]}>
      {children}
    </Text>
  ),
  heading2: (node, children, parent, styles) => (
    <Text key={Math.floor(Math.random() * Math.floor(100000))} style={[styles.heading, styles.heading2]}>
      {children}
    </Text>
  ),
  paragraph: (node, children, parent, styles) => (
    <Text key={Math.floor(Math.random() * Math.floor(100000))} style={[styles.heading, styles.heading3]}>
      {children}
    </Text>
  )
}

const MarkdownRender = props => {
  return <Markdown rules={rules}>{props.content}</Markdown>
}

const styles = StyleSheet.create({
  heading: {
    borderBottomWidth: 1,
    borderColor: "#000000"
  },
  heading1: {
    fontSize: 32,
    backgroundColor: "#000000",
    color: "#FFFFFF"
  },
  heading2: {
    fontSize: 24
  },
  heading3: {
    fontSize: 22,
    marginBottom: 10
  },
  heading4: {
    fontSize: 16
  },
  heading5: {
    fontSize: 13
  },
  heading6: {
    fontSize: 11
  }
})

export { MarkdownRender }
