import React from "react";
import { View } from "react-native";
import ChapterCard from "./ChapterCard";

const ChapterList = props => {
  return (
    <View>
      {props.chapters.map((chapter, index) => {
        return (
          <ChapterCard
            {...chapter}
            user={props.user}
            currentUser={props.currentUser}
            key={index}
            persistOfflineChapter={props.persistOfflineChapter}
            handleSelectChapter={props.handleSelectChapter}
          />
        );
      })}
    </View>
  );
};

export default ChapterList;
