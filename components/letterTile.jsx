import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  InputAccessoryView,
  Text,
} from "react-native";

const LetterTile = props => {
  
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if(props.nextFocus && props.nextFocus[0] == props.rowIndex && props.nextFocus[1] == props.index) {
      inputRef.current.focus();
    }
  }, [props.nextFocus]);

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

  const onKeyPress = (e) => {
    if (e.nativeEvent.key === 'Backspace') {
      props.setValue(props.rowIndex, props.index, '');
      props.setNextFocus(props.rowIndex, props.index, -1);
    } else {
      props.setValue(props.rowIndex, props.index, e.nativeEvent.key);
      // move to next letter
      props.setNextFocus(props.rowIndex, props.index, 1);
    }
    console.log('onKeyPress event.key: '+e.nativeEvent.key)
    console.log('should be key: '+props.tileData.letter)
    console.log('hint: '+props.words[props.focusedWordIndex]?.hint)
  }

  return props.tileData.letter ? (
    <View>
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
        autoCapitalize='characters'
        value={props.value}
        maxLength={1}
        onTouchEnd={onTouchEnd}
        caretHidden={true}
        ref={props.index + ','+props.rowIndex}
        inputAccessoryViewID={props.index + ','+props.rowIndex}
        onKeyPress={onKeyPress}
        ref={inputRef}
      />
      <InputAccessoryView nativeID={props.index + ','+props.rowIndex}>
        <View style={styles.hintBar} >
            <Text style={styles.hint} >{props.words[props.focusedWordIndex]?.hint}</Text>
        </View>
      </InputAccessoryView>
    </View>
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
  },
  hintBar: {
    flex: 1,
    height: 45,
    width: '100%',
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  hint: {
    //position: 'absolute',
    fontSize: 24,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  }
});
