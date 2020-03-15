import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
} from "react-native";

const LetterTile = props => {
  const [value, onChangeText] = React.useState();

  const onTouchEnd = () => {
    // explicit "!= null" so that 0 index is not false
    if (props.tileData.horizontalWordIndex != null && props.tileData.verticalWordIndex == null) {
      props.letterFocus(props.tileData.horizontalWordIndex, props.rowIndex, props.index, false);
    } else if (props.tileData.horizontalWordIndex == null && props.tileData.verticalWordIndex != null) {
      props.letterFocus(props.tileData.verticalWordIndex, props.rowIndex, props.index, true);
    } else if (props.tileData.horizontalWordIndex != null && props.tileData.verticalWordIndex != null) {
      if (props.focusedLetterIndex === props.index && props.rowIndex === props.focusedRowIndex) {
        if (props.isCurrentFocusVertical) { // do the opposite of current focus if we're touching the same tile again
          props.letterFocus(props.tileData.horizontalWordIndex, props.rowIndex, props.index, false);
        } else {
          props.letterFocus(props.tileData.verticalWordIndex, props.rowIndex, props.index, true);
        }
      } else {
        if (props.isCurrentFocusVertical) { // for a new tile stay with current direction
          props.letterFocus(props.tileData.verticalWordIndex, props.rowIndex, props.index, true);
        } else {
          props.letterFocus(props.tileData.horizontalWordIndex, props.rowIndex, props.index, false);
        }
      }
    } 
  }

  return props.tileData.letter ? (
    <TextInput
      style={[
        styles.letterTile,
        (props.focusedWordIndex == props.tileData.horizontalWordIndex ||
          props.focusedWordIndex == props.tileData.verticalWordIndex) &&
          styles.letterTileWordIsFocused,
        (props.focusedLetterIndex === props.index && props.rowIndex === props.focusedRowIndex) &&
        styles.letterTileLetterIsFocused,
      ]}
      autoCorrect={false}
      onChangeText={text => onChangeText(text)}
      value={value}
      maxLength={1}
      onTouchEnd={onTouchEnd}
    />
  ) : (
    <View style={styles.blankTile} />
  );
};
export default LetterTile;

const TILE_HEIGHT = 40;
const TILE_WIDTH = 40;

const styles = StyleSheet.create({
  letterTile: {
    height: TILE_HEIGHT,
    width: TILE_WIDTH,
    borderColor: "gray",
    borderWidth: 1,
    fontSize: 26,
    textAlign: "center",
    backgroundColor: 'white'
  },
  letterTileWordIsFocused: {
    backgroundColor: "lightblue"
  },
  letterTileLetterIsFocused: {
    backgroundColor: 'yellow'
  },
  blankTile: {
    height: TILE_HEIGHT,
    width: TILE_WIDTH,
    backgroundColor: '#D0D0D0'
  }
});
