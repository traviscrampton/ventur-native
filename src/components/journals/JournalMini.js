import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Dimensions
} from "react-native";
import ProgressiveImage from "../shared/ProgressiveImage";

const pad = Dimensions.get("window").width * 0.04;
const imageGaps = Dimensions.get("window").width * 0.11;
const imageWidth = (Dimensions.get("window").width - imageGaps) / 2;

const getDistanceString = distance => {
  const {
    distanceType,
    kilometerAmount,
    mileAmount,
    readableDistanceType
  } = distance;
  switch (distanceType) {
    case "kilometer":
      return `${kilometerAmount} ${readableDistanceType}`;

    case "mile":
      return `${mileAmount} ${readableDistanceType}`;

    default:
      return "";
  }
};

const getStatusText = props => {
  let distanceString = getDistanceString(props.distance);

  return (
    <Text style={styles.metadata}>
      {`${props.status}`.replace("_", " ").toUpperCase()} {`\u2022`}{" "}
      {`${distanceString}`.toUpperCase()}
    </Text>
  );
};

const JournalMini = props => {
  const statusText = getStatusText(props);

  return (
    <View
      style={{
        height: imageWidth,
        width: imageWidth,
        marginBottom: pad,
        backgroundColor: "lightgray",
        borderRadius: 10
      }}
    >
      <ProgressiveImage
        style={styles.imageBackground}
        thumbnailSource={props.thumbnailSource}
        source={props.cardBannerImageUrl}
      />
      <TouchableWithoutFeedback
        style={styles.zIndexHunnit}
        onPress={() => props.handlePress(props.id)}
      >
        <View style={styles.metadataContainer}>
          <Text numberOfLines={2} style={styles.title}>
            {props.title}
          </Text>
          {statusText}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    width: imageWidth,
    height: imageWidth,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d3d3d3"
  },
  zIndexHunnit: { zIndex: 100 },
  borderRadius: {
    borderRadius: 10
  },
  metadataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100
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
});

export default JournalMini;
