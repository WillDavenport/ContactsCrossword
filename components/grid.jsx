import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import LetterTile from './letterTile'

const Grid = (props) => {
  const [focusedWordIndex, setFocusedWordIndex] = React.useState(-1);
  const [focusedRowIndex, setFocusedRowIndex] = React.useState(-1);
  const [focusedLetterIndex, setFocusedLetterIndex] = React.useState(-1);
  const [isCurrentFocusVertical, setIsCurrentFocusVertical] = React.useState(false);

  const word = ['S','M','I','T','H'];

  wordIndexFocused = (focused, rowIndex, letterIndex, isVerticalFocus) => {
    setFocusedWordIndex(focused);
    setFocusedRowIndex(rowIndex);
    setFocusedLetterIndex(letterIndex);
    setIsCurrentFocusVertical(isVerticalFocus);
    props.setCurrentWordIndex(focused);
  }
  
  return (
    <View style={styles.grid}>
      {props.grid.map((row, rowIndex)=> (
          <View style={styles.row} key={rowIndex} >
              {row.map((tile, index)=>(
                  <LetterTile
                    key={index}
                    index={index}
                    rowIndex={rowIndex}
                    isCurrentFocusVertical={isCurrentFocusVertical}
                    letterFocus={(focused, rowIndex, letterIndex, isVerticalFocus) => wordIndexFocused(focused, rowIndex, letterIndex, isVerticalFocus)}
                    focusedWordIndex={focusedWordIndex}
                    tileData={tile}
                    focusedRowIndex={focusedRowIndex}
                    focusedLetterIndex={focusedLetterIndex}
                  />
              ))}
          </View>
      ))}
    </View>
  );
}
export default Grid;

const styles = StyleSheet.create({
  grid: {
    flex: 4,
    backgroundColor: '#fff',
    height: 'auto',
    alignItems: 'center',
  },
  row: {
      flexDirection: 'row',
  }
});
