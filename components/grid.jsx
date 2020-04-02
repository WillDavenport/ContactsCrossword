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
  const [goalGridValues, setGoalGridValues] = React.useState([]);
  const [victory, setVictory] = React.useState(false);
  const [checkedLetters, setCheckedLetters] = React.useState({});
  const [lettersChecked, setLettersChecked] = React.useState(0);

  React.useEffect(() => {
    if(props.grid) {
        let gridVals = new Array(props.grid.length);
        let goalGridVals = new Array(props.grid.length);
        for(var r = 0; r < props.grid.length; r++){
            gridVals[r] = new Array(props.grid[0].length);
            goalGridVals[r] = new Array(props.grid[0].length);
            for(var c = 0; c < props.grid[0].length; c++) {
                gridVals[r][c] = '';
                goalGridVals[r][c] = props.grid[r][c].letter || '' 
            }
        }
        setGridValues(gridVals);
        setGoalGridValues(goalGridVals);
        setVictory(false);
        setCheckedLetters({});
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

  checkLetter= (rowIndex, letterIndex) => {
    let key = rowIndex+','+letterIndex;
    setCheckedLetters({...checkedLetters, [key]: true});
    console.log('Check letter, checkLetters: ',checkedLetters)

    setGridVal(rowIndex, letterIndex, goalGridValues[rowIndex][letterIndex]);
    setLettersChecked(lettersChecked + 1);

    // TODO: decrement score
  }

  setGridVal = (row, col, value) => {
    console.log('setGridVal: row: ',row,' col: ',col,' value: ',value)
    let gridVals = gridValues;
    
    gridVals[row] && (gridVals[row][col] = value);
    
    
    // check if victory is achieved
    if (gridVals[0] && gridVals.length === goalGridValues.length && gridVals[0].length == goalGridValues[0].length) {
        let foundDiffference = false;
        for (var r = 0; r < props.grid.length; r++) {
            for(var c = 0; c < props.grid[0].length; c++) {
                if (gridVals[r][c] != goalGridValues[r][c]) {
                    foundDiffference = true;
                }
            }
        }
        if (!foundDiffference) {
            console.log('VICTORY!')
            setVictory(true);
            props.gameOver(lettersChecked);
            setLettersChecked(0);
        }
    }

    setGridValues(gridVals)
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
                    victory={victory || checkedLetters[rowIndex+','+index]}
                    checkLetter={(rowIndex, index) => checkLetter(rowIndex, index)}
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
    flex: 10,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  row: {
      flexDirection: 'row',
      width: '100%'
  }
});
