import React from "react"
import { StyleSheet, View } from "react-native"
import ChapterCard from "components/chapters/ChapterCard"

const ChapterList = props => {
  console.log(props.chapters[0])
  return (
    <View>
      {props.chapters.map((chapter, index) => {
        return <ChapterCard {...chapter} key={index} handleSelectChapter={props.handleSelectChapter} />
      })}
    </View>
  )
}

export default ChapterList
