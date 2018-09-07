import React from "react"
import { StyleSheet, View } from "react-native"
import ChapterCard from "components/chapters/chapter_card"

const ChapterList = props => {
  return (
    <View>
      {props.chapters.map((chapter, index) => {
        return <ChapterCard {...chapter} key={index} handleSelectChapter={props.handleSelectChapter} />
      })}
    </View>
  )
}

export default ChapterList
