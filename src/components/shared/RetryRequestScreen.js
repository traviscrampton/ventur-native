import React from "react";
import { View, TouchableWithoutFeedback, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const RetryRequesetScreen = props => {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={props.reload}>
        <View style={styles.reload}>
          <MaterialCommunityIcons name="reload" size={50} />
          <Text>Something went wrong, try again.</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  reload: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
});

export default RetryRequesetScreen;
