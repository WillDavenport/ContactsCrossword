import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  InputAccessoryView,
  Text,
  Button
} from "react-native";

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

class LetterTile extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  state = {
    value: this.props.value
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.nextFocus !== prevProps.nextFocus &&
      this.props.nextFocus[0] == this.props.rowIndex &&
      this.props.nextFocus[1] == this.props.index
    ) {
      this.inputRef.current.focus();
    }
    if (this.props.value !== prevProps.value) {
      this.setState({ value: this.props.value });
    }
  }

  onTouchEnd = () => {
    // explicit "!= null" so that 0 index is not false
    if (
      this.props.tileData.horizontalWordIndex != null &&
      this.props.tileData.verticalWordIndex == null
    ) {
      this.props.letterFocus(
        this.props.tileData.horizontalWordIndex,
        this.props.rowIndex,
        this.props.index,
        false
      );
    } else if (
      this.props.tileData.horizontalWordIndex == null &&
      this.props.tileData.verticalWordIndex != null
    ) {
      this.props.letterFocus(
        this.props.tileData.verticalWordIndex,
        this.props.rowIndex,
        this.props.index,
        true
      );
    } else if (
      this.props.tileData.horizontalWordIndex != null &&
      this.props.tileData.verticalWordIndex != null
    ) {
      if (
        this.props.focusedLetterIndex === this.props.index &&
        this.props.rowIndex === this.props.focusedRowIndex
      ) {
        if (this.props.isCurrentFocusVertical) {
          // do the opposite of current focus if we're touching the same tile again
          this.props.letterFocus(
            this.props.tileData.horizontalWordIndex,
            this.props.rowIndex,
            this.props.index,
            false
          );
        } else {
          this.props.letterFocus(
            this.props.tileData.verticalWordIndex,
            this.props.rowIndex,
            this.props.index,
            true
          );
        }
      } else {
        if (this.props.isCurrentFocusVertical) {
          // for a new tile stay with current direction
          this.props.letterFocus(
            this.props.tileData.verticalWordIndex,
            this.props.rowIndex,
            this.props.index,
            true
          );
        } else {
          this.props.letterFocus(
            this.props.tileData.horizontalWordIndex,
            this.props.rowIndex,
            this.props.index,
            false
          );
        }
      }
    }
  };

  onKeyPress = e => {
    if (!this.props.victory) {
    if (e.nativeEvent.key === "Backspace") {
      if (this.state.value === '') { // already nothing here so delete key behind
        this.props.setNextFocus(this.props.rowIndex, this.props.index, -1);
      }
      this.props.setValue(this.props.rowIndex, this.props.index, "");
      this.setState({ value: "" });
    } else {
        this.props.setValue(
          this.props.rowIndex,
          this.props.index,
          e.nativeEvent.key.toUpperCase()
        );
        // move to next letter
        this.props.setNextFocus(this.props.rowIndex, this.props.index, 1);
        this.setState({ value: e.nativeEvent.key.toUpperCase() });
      
    } 
  } else { // we don't want to change value if we've checked this letter, only want to move focus
    if (e.nativeEvent.key === "Backspace") {
      this.props.setNextFocus(this.props.rowIndex, this.props.index, -1);
    } else {
      // move to next letter
      this.props.setNextFocus(this.props.rowIndex, this.props.index, 1);
    }
  }
    console.log("onKeyPress event.key: " + e.nativeEvent.key);
    console.log("should be key: " + this.props.tileData.letter);
    console.log("hint: " + this.props.words[this.props.focusedWordIndex]?.hint);
  };

  render() {
    return this.props.tileData.letter ? (
      <View
        style={styles.letterTileContainer}
      >
        <TextInput
          style={[
            styles.letterTile,
            (this.props.focusedWordIndex ==
              this.props.tileData.horizontalWordIndex ||
              this.props.focusedWordIndex ==
                this.props.tileData.verticalWordIndex) &&
              styles.letterTile_wordIsFocused,
            this.props.focusedLetterIndex === this.props.index &&
              this.props.rowIndex === this.props.focusedRowIndex &&
              styles.letterTile_letterIsFocused,
            (this.props.victory && this.props.tileData.letter === this.state.value) && styles.letterTile_checkedCorrect,
            (this.props.victory && this.props.tileData.letter !== this.state.value) && styles.letterTile_checkedWrong
          ]}
          autoCorrect={false}
          autoCapitalize="characters"
          value={this.props.victory ? this.props.tileData.letter : this.state.value}
          maxLength={1}
          onTouchEnd={this.onTouchEnd}
          caretHidden={true}
          ref={this.props.index + "," + this.props.rowIndex}
          inputAccessoryViewID={this.props.index + "," + this.props.rowIndex}
          onKeyPress={this.onKeyPress}
          ref={this.inputRef}
        />
        <InputAccessoryView
          nativeID={this.props.index + "," + this.props.rowIndex}
        >
          <View style={styles.hintBar}>
            <Button
              style={styles.checkLetterButton}
              title="✓" 
              onPress={() => this.props.checkLetter(this.props.rowIndex, this.props.index)}
            />
            <Text style={styles.hint}>
              {this.props.words[this.props.focusedWordIndex]?.hint}
            </Text>
            <Button
              title='' 
              style={styles.checkLetterButton}
            />
          </View>
        </InputAccessoryView>
      </View>
    ) : (
      <View style={styles.blankTile} />
    );
  }
}

export default LetterTile;

const styles = StyleSheet.create({
  letterTileContainer: {
    aspectRatio: 1, // makes undefined height equal to width
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: "black",
  },
  letterTile: {
    flex: 1,
    fontSize: 26,
    textAlign: "center",
    backgroundColor: "white"
  },
  letterTile_wordIsFocused: {
    backgroundColor: "lightblue"
  },
  letterTile_letterIsFocused: {
    backgroundColor: "yellow"
  },
  letterTile_checkedCorrect: {
    backgroundColor: "#1ec31e",
    fontWeight: 'bold'
  },
  letterTile_checkedWrong: {
    backgroundColor: "red",
    fontWeight: 'bold'
  },
  blankTile: {
    aspectRatio: 1, // makes undefined height equal to width
    borderWidth: 1,
    borderColor: "grey",
    flex: 1,
    flexDirection: 'row',
    backgroundColor: "#D0D0D0"
  },
  hintBar: {
    flex: 1,
    height: 60,
    paddingHorizontal: 10,
    width: "100%",
    flexDirection: 'row',
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center"
  },
  checkLetterButton: {
    flex: 1,
  },
  hint: {
    flex: 6,
    fontSize: 24,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center"
  }
});
