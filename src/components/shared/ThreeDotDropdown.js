import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { connectActionSheet } from '@expo/react-native-action-sheet';

class ThreeDotDropdown extends Component {
  constructor(props) {
    super(props);
  }

  openActionSheet = () => {
    let options = this.props.options.map((option, index) => {
      return option.title;
    });

    options.push('Cancel');

    const destructiveButtonIndex = options.length;
    const cancelButtonIndex = options.length - 1;

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex
      },
      buttonIndex => {
        if (buttonIndex === cancelButtonIndex) return;

        this.props.options[buttonIndex].callback();
      }
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.openActionSheet}>
          <View style={styles.inner}>
            <MaterialCommunityIcons
              style={styles.textAlignCenter}
              name="dots-vertical"
              size={32}
              color="#D7D7D7"
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { position: 'relative' },
  inner: { paddingTop: 2, width: 40, height: 40 },
  textAlignCenter: { textAlign: 'center' }
});

export default connectActionSheet(ThreeDotDropdown);
