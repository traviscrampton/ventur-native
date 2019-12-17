import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const StarRating = props => {
  const { rating, size } = props;
  return (
    <View style={styles.container}>
      {[...Array(rating)].map((e, i) => {
        return <MaterialIcons name="star" color="gold" size={size} key={i} />;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row'
  }
});

export default StarRating;
