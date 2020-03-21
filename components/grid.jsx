import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import LetterTile from './letterTile'

const Grid = (props) => {
  const [focusedWordIndex, setFocusedWordIndex] = React.useState(-1);
  const [focusedRowIndex, setFocusedRowIndex] = React.useState(-1);
  const [focusedLetterIndex, setFocusedLetterIndex] = React.useState(-1);
  const [isCurrentFocusVertical, setIsCurrentFocusVertical] = React.useState(false);
  const [nextFocusIndex, setNextFocusIndex] = React.useState([]);
  const [gridValues, setGridValues] = React.useState([]);

  React.useEffect(() => {
    if(props.grid) {
        let gridVals = new Array(props.grid.length);
        for(var r = 0; r < props.grid.length; r++){
            gridVals[r] = new Array(props.grid[0].length);
            for(var c = 0; c < props.grid[0].length; c++) {
                gridVals[r][c] = '';
            }
        }
        setGridValues(gridVals);
    }
  }, [props.grid]);
  
  wordIndexFocused = (focused, rowIndex, letterIndex, isVerticalFocus) => {
    setFocusedWordIndex(focused);
    setFocusedRowIndex(rowIndex);
    setFocusedLetterIndex(letterIndex);
    setIsCurrentFocusVertical(isVerticalFocus);
    props.setCurrentWordIndex(focused);
  }

  setNextFocus = (rowIndex, index, increment) => {
    if (isCurrentFocusVertical) {
        if (props.grid[rowIndex+increment] && props.grid[rowIndex+increment][index].letter) {
            setNextFocusIndex([rowIndex+increment,index]);
            setFocusedRowIndex(rowIndex+increment);
            setFocusedLetterIndex(index);
        }
    } else {
        if (props.grid[rowIndex][index+increment]?.letter) {
            setNextFocusIndex([rowIndex,index+increment]);
            setFocusedRowIndex(rowIndex);
            setFocusedLetterIndex(index+increment);
        }
    }
  }

  setGridVal = (row, col, value) => {
    console.log('setGridVal: row: ',row,' col: ',col,' value: ',value)
    let gridVals = gridValues;
    console.log('gridVals: ',gridVals)
    gridVals[row] && (gridVals[row][col] = value);

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
                    setNextFocus={setNextFocus}
                    nextFocus={nextFocusIndex}
                    words={props.words}
                    value={gridValues[rowIndex]? gridValues[rowIndex][index] : ''}
                    setValue={setGridVal}
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
    flex: 9,
    backgroundColor: '#fff',
    height: 'auto',
    alignItems: 'center',
  },
  row: {
      flexDirection: 'row',
  }
});
