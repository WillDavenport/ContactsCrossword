import React, {Component} from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import LetterTile from './letterTile';
import { connectActionSheet } from '@expo/react-native-action-sheet';

class Grid extends Component {
  state = { 
    focusedWordIndex: -1,
    focusedRowIndex: -1,
    focusedLetterIndex: -1,
    isCurrentFocusVertical: false,
    nextFocusIndex: [],
    gridValues: [],
    goalGridValues: [],
    victory: false,
    checkedLetters: {},
    lettersChecked: 0,
  }

  componentDidMount() {
    let gridVals = new Array(this.props.grid.length);
        let goalGridVals = new Array(this.props.grid.length);
        for(var r = 0; r < this.props.grid.length; r++){
            gridVals[r] = new Array(this.props.grid[0].length);
            goalGridVals[r] = new Array(this.props.grid[0].length);
            for(var c = 0; c < this.props.grid[0].length; c++) {
                gridVals[r][c] = '';
                goalGridVals[r][c] = this.props.grid[r][c].letter || '' 
            }
        }
        this.setState({
          gridValues: gridVals,
          goalGridValues: goalGridVals,
          victory: false,
          checkedLetters: {}
        })
  }
  
  componentDidUpdate(prevProps) {
    if(this.props.grid !== prevProps.grid) {
        let gridVals = new Array(this.props.grid.length);
        let goalGridVals = new Array(this.props.grid.length);
        for(var r = 0; r < this.props.grid.length; r++){
            gridVals[r] = new Array(this.props.grid[0].length);
            goalGridVals[r] = new Array(this.props.grid[0].length);
            for(var c = 0; c < this.props.grid[0].length; c++) {
                gridVals[r][c] = '';
                goalGridVals[r][c] = this.props.grid[r][c].letter || '' 
            }
        }
        this.setState({
          gridValues: gridVals,
          goalGridValues: goalGridVals,
          victory: false,
          checkedLetters: {},
        })
    }
    if(this.props.openActionSheet !== prevProps.openActionSheet) {
      if(this.props.openActionSheet) {
        this.openActionSheet();
        this.props.resetActionSheetCall();
      }
    }
  }

  openActionSheet = () => {
    const options = ['Reveal Letter', 'Reveal Word', 'Reveal Puzzle', 'Cancel'];
    const cancelButtonIndex = 3;

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      buttonIndex => {
        // Do something here depending on the button index selected
        if (buttonIndex == 0) {
          this.checkLetter(this.state.focusedRowIndex, this.state.focusedLetterIndex);
        }
        if (buttonIndex == 1) {
          this.checkWord();
        }
        if (buttonIndex == 2) {
          this.checkPuzzle();
        }
      },
    );
  }
  
  wordIndexFocused = (focused, rowIndex, letterIndex, isVerticalFocus) => {
    this.setState({
      focusedWordIndex: focused,
      focusedRowIndex: rowIndex,
      focusedLetterIndex: letterIndex,
      isCurrentFocusVertical: isVerticalFocus,
    })
    this.props.setCurrentWordIndex(focused);
  }

  setNextFocus = (rowIndex, index, increment) => {
   if (this.state.isCurrentFocusVertical) {
        if (this.props.grid[rowIndex+increment] && this.props.grid[rowIndex+increment][index].letter) {
            this.setState({
              nextFocusIndex: [rowIndex+increment,index],
              focusedRowIndex: rowIndex+increment,
              focusedLetterIndex: index,
            });
        }
    } else {
        if (this.props.grid[rowIndex][index+increment]?.letter) {
            this.setState({
              nextFocusIndex: [rowIndex,index+increment],
              focusedRowIndex: rowIndex,
              focusedLetterIndex: index+increment,
            });
        }
    }
  }

  checkPuzzle = () => {
    for (var r = 0; r < this.props.grid.length; r++) {
      for(var c = 0; c < this.props.grid[0].length; c++) {
        this.checkLetter(r,c);
      }
    }
  }
  
  checkWord = () => {
    if(this.state.focusedWordIndex !== -1) {
      for (var r = 0; r < this.props.grid.length; r++) {
        for(var c = 0; c < this.props.grid[0].length; c++) {
          if (this.props.grid[r][c].horizontalWordIndex == this.state.focusedWordIndex || this.props.grid[r][c].verticalWordIndex == this.state.focusedWordIndex) {
            this.checkLetter(r,c);
          }
        }
      }
    }
  }

  checkLetter= (rowIndex, letterIndex) => {
    if (this.state.goalGridValues[rowIndex] && this.state.goalGridValues[rowIndex][letterIndex]) {
      let key = rowIndex+','+letterIndex;

      this.setGridVal(rowIndex, letterIndex, this.state.goalGridValues[rowIndex][letterIndex]);

      this.setState({
        checkedLetters: {...this.state.checkedLetters, [key]: true},
        lettersChecked: this.state.lettersChecked + 1
      })
    }
  }

  setGridVal = (row, col, value) => {
    let gridVals = this.state.gridValues;
    
    gridVals[row] && (gridVals[row][col] = value);
    
    
    // check if victory is achieved
    if (gridVals[0] && gridVals.length === this.state.goalGridValues.length && gridVals[0].length == this.state.goalGridValues[0].length) {
        let foundDiffference = false;
        for (var r = 0; r < this.props.grid.length; r++) {
            for(var c = 0; c < this.props.grid[0].length; c++) {
                if (gridVals[r][c] != this.state.goalGridValues[r][c]) {
                    foundDiffference = true;
                }
            }
        }
        if (!foundDiffference) {
            this.props.gameOver(this.state.lettersChecked);
            this.setState({
              victory: true,
              lettersChecked: 0
            })
        }
    }
    this.setState({gridValues: gridVals});
  }
  
  render() { 
    return (
      <View style={styles.grid}>
        {this.props.grid.map((row, rowIndex)=> (
            <View style={styles.row} key={rowIndex} >
                {row.map((tile, index)=>(
                    <LetterTile
                      key={index}
                      index={index}
                      rowIndex={rowIndex}
                      isCurrentFocusVertical={this.state.isCurrentFocusVertical}
                      letterFocus={(focused, rowIndex, letterIndex, isVerticalFocus) => this.wordIndexFocused(focused, rowIndex, letterIndex, isVerticalFocus)}
                      focusedWordIndex={this.state.focusedWordIndex}
                      tileData={tile}
                      focusedRowIndex={this.state.focusedRowIndex}
                      focusedLetterIndex={this.state.focusedLetterIndex}
                      setNextFocus={this.setNextFocus}
                      nextFocus={this.state.nextFocusIndex}
                      words={this.props.words}
                      value={this.state.gridValues[rowIndex]? this.state.gridValues[rowIndex][index] : ''}
                      setValue={this.setGridVal}
                      victory={this.state.victory || this.state.checkedLetters[rowIndex+','+index]}
                      checkLetter={(rowIndex, index) => this.checkLetter(rowIndex, index)}
                    />
                ))}
            </View>
        ))}
      </View>
    );
  }
}

const ConnectedGrid = connectActionSheet(Grid)

export default ConnectedGrid;

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
