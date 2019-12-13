import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  View,
  Image
} from "react-native";
import { Header } from "./header";
import {
  updateActiveImageCaption,
  updateImageCaption,
  updateActiveIndex
} from "../../actions/editor";

const mapStateToProps = state => ({
  entries: state.editor.entries,
  activeCaption: state.editor.activeCaption,
  width: state.common.width,
  height: state.common.height
});

const mapDispatchToProps = dispatch => ({
  updateImageCaption: payload => dispatch(updateImageCaption(payload)),
  updateActiveIndex: payload => dispatch(updateActiveIndex(payload)),
  updateActiveImageCaption: payload =>
    dispatch(updateActiveImageCaption(payload))
});

class ImageCaptionForm extends Component {
  constructor(props) {
    super(props);
    this.index = this.props.navigation.getParam("index", "NO-ID");
    this.handleGoBack = this.handleGoBack.bind(this);
    this.saveCaption = this.saveCaption.bind(this);
  }

  saveCaption() {
    const entry = {
      ...this.props.entries[this.index],
      caption: this.props.activeCaption
    };
    const payload = { entry: entry, index: this.index };
    this.props.updateImageCaption(payload);
    this.props.navigation.goBack();
  }

  handleGoBack() {
    this.props.updateActiveImageCaption("");
    this.props.updateActiveIndex(null);
    this.props.navigation.goBack();
  }

  renderHeader() {
    const headerProps = {
      goBackCta: "Cancel",
      handleGoBack: this.handleGoBack,
      centerCta: "Add Caption",
      handleConfirm: this.saveCaption,
      confirmCta: "Add"
    };
    return <Header key="header" {...headerProps} />;
  }

  renderImage() {
    const image = this.props.entries[this.index];
    return (
      <Image
        key="image"
        style={[styles.image, { width: this.props.width }]}
        source={{ uri: image.uri }}
      />
    );
  }

  updateActiveImageCaption(text) {
    this.props.updateActiveImageCaption(text);
  }

  renderForm() {
    return (
      <View key="captionForm">
        <View style={styles.padding20}>
          <Text style={styles.fontWeightBold}>
            {this.props.activeCaption.length} / 200
          </Text>
        </View>
        <TextInput
          autoFocus
          multiline
          selectionColor={"#FF5423"}
          style={styles.textAlignCenter}
          value={this.props.activeCaption}
          maxLength={200}
          onChangeText={text => this.updateActiveImageCaption(text)}
        />
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.backgroundWhite}>
        <View style={[styles.backgroundWhite, { height: this.props.height }]}>
          {this.renderHeader()}
          {this.renderImage()}
          {this.renderForm()}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    height: 250
  },
  padding20: {
    padding: 20
  },
  backgroundWhite: {
    backgroundColor: "white"
  },
  fontWeightBold: {
    fontWeight: "bold"
  },
  textAlignCenter: {
    padding: 20,
    textAlign: "center"
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageCaptionForm);
