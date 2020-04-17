import React, {Component} from 'react';
import { StyleSheet, Text, View, Button, TextInput, Dimensions } from 'react-native';
import LetterTile from './letterTile';
import { connectActionSheet } from '@expo/react-native-action-sheet';

const window = Dimensions.get("window");

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
    lettersCorrect: 0,
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
          if (increment === -1) {  
            this.setState({
              nextFocusIndex: [rowIndex+increment,index],
              focusedRowIndex: rowIndex+increment,
              focusedLetterIndex: index,
            });
            this.setGridVal(rowIndex+increment,index, '');
          } else {
            this.setState({
              nextFocusIndex: [rowIndex+increment,index],
              focusedRowIndex: rowIndex+increment,
              focusedLetterIndex: index,
            });
          }
        }
    } else {
        if (this.props.grid[rowIndex][index+increment]?.letter) {
          if (increment === -1) {
            this.setState({
              nextFocusIndex: [rowIndex,index+increment],
              focusedRowIndex: rowIndex,
              focusedLetterIndex: index+increment,
            });
            this.setGridVal(rowIndex,index+increment, '');
          } else {
            this.setState({
              nextFocusIndex: [rowIndex,index+increment],
              focusedRowIndex: rowIndex,
              focusedLetterIndex: index+increment,
            });
          }
        }
    }
  }

  checkPuzzle = () => {
    let numLettersChecked = this.state.lettersChecked;
    for (var rowIndex = 0; rowIndex < this.props.grid.length; rowIndex++) {
      for(var letterIndex = 0; letterIndex < this.props.grid[0].length; letterIndex++) {
        // check letter block
        let key = rowIndex+','+letterIndex;
        if (this.state.goalGridValues[rowIndex] && this.state.goalGridValues[rowIndex][letterIndex] && !(this.state.checkedLetters[key])) {
          if (this.state.goalGridValues[rowIndex][letterIndex] === this.state.gridValues[rowIndex][letterIndex]) { // already correct
            
          } else{ // wrong
            numLettersChecked++;
          }
        }
      }
    }
    this.props.gameOver(numLettersChecked, this.state.lettersCorrect);
    this.setState({
      victory: true,
      lettersChecked: 0,
      lettersCorrect: 0,
      focusedWordIndex: -1,
      focusedRowIndex: -1,
      focusedLetterIndex: -1,
      isCurrentFocusVertical: false,
      nextFocusIndex: [],
    });
  }
  
  checkWord = () => {
    if(this.state.focusedWordIndex !== -1) {
      for (var rowIndex = 0; rowIndex < this.props.grid.length; rowIndex++) {
        for(var letterIndex = 0; letterIndex < this.props.grid[0].length; letterIndex++) {
          let key = rowIndex+','+letterIndex;
          if ((this.props.grid[rowIndex][letterIndex].horizontalWordIndex == this.state.focusedWordIndex || 
              this.props.grid[rowIndex][letterIndex].verticalWordIndex == this.state.focusedWordIndex) && 
              !(this.state.checkedLetters[key])
              ) {
            // check letter
            if (this.state.goalGridValues[rowIndex][letterIndex] === this.state.gridValues[rowIndex][letterIndex]) { // already correct
              this.setState({
                checkedLetters: {...this.state.checkedLetters, [key]: true},
              })
      
            } else { // wrong
              this.setState({
                checkedLetters: {...this.state.checkedLetters, [key]: true},
                lettersChecked: this.state.lettersChecked + 1
              })
            }
          }
        }
      }
      // check if puzzle completed
      if (this.state.gridValues[0] && this.state.gridValues.length === this.state.goalGridValues.length && this.state.gridValues[0].length == this.state.goalGridValues[0].length) {
          let foundDiffference = false;
          for (var r = 0; r < this.props.grid.length; r++) {
              for(var c = 0; c < this.props.grid[0].length; c++) {
                  if (this.state.gridValues[r][c] != this.state.goalGridValues[r][c] && !(this.state.checkedLetters[r+','+c])) { 
                    foundDiffference = true;
                  }
              }
          }
          if (!foundDiffference) {
              this.props.gameOver(this.state.lettersChecked, this.state.lettersCorrect);
              this.setState({
                victory: true,
                lettersChecked: 0,
                lettersCorrect: 0,
                focusedWordIndex: -1,
                focusedRowIndex: -1,
                focusedLetterIndex: -1,
                isCurrentFocusVertical: false,
                nextFocusIndex: [],
              })
          }
      }
    }
  }

  checkLetter= (rowIndex, letterIndex) => {
    let key = rowIndex+','+letterIndex;
    if (this.state.goalGridValues[rowIndex] && this.state.goalGridValues[rowIndex][letterIndex] && !(this.state.checkedLetters[key])) {
      if (this.state.goalGridValues[rowIndex][letterIndex] === this.state.gridValues[rowIndex][letterIndex]) { // already correct
        this.setState({
          checkedLetters: {...this.state.checkedLetters, [key]: true},
        })

      } else { // wrong
        this.setState({
          checkedLetters: {...this.state.checkedLetters, [key]: true},
          lettersChecked: this.state.lettersChecked + 1
        })
        // check if puzzle completed
        if (this.state.gridValues[0] && this.state.gridValues.length === this.state.goalGridValues.length && this.state.gridValues[0].length == this.state.goalGridValues[0].length) {
            let foundDiffference = false;
            for (var r = 0; r < this.props.grid.length; r++) {
                for(var c = 0; c < this.props.grid[0].length; c++) {
                    if (this.state.gridValues[r][c] != this.state.goalGridValues[r][c] && !(r+','+c ===  key || this.state.checkedLetters[r+','+c])) {
                      foundDiffference = true;
                    }
                }
            }
            if (!foundDiffference) {
                this.props.gameOver(this.state.lettersChecked, this.state.lettersCorrect);
                this.setState({
                  victory: true,
                  lettersChecked: 0,
                  lettersCorrect: 0,
                  focusedWordIndex: -1,
                  focusedRowIndex: -1,
                  focusedLetterIndex: -1,
                  isCurrentFocusVertical: false,
                  nextFocusIndex: [],
                })
            }
        }
      }
    }
    // move to next letter focus
    this.setNextFocus(rowIndex, letterIndex, 1);
  }

  setGridVal = (row, col, value) => {
    if (!this.state.checkedLetters[row+','+col]) {
      console.log('setting grid val: ', value,' row: ',row, ', col: ',col)
      let gridVals = this.state.gridValues;
      
      let changeToLettersCorrect = 0;
      if (value == this.state.goalGridValues[row][col]) { // this one is right
        if (this.state.gridValues[row][col] != this.state.goalGridValues[row][col]) { // used to be wrong
          console.log('changeToLettersCorrect = 1')
          changeToLettersCorrect = 1;
        }
      } else { 
        if (this.state.gridValues[row][col] == this.state.goalGridValues[row][col]) { // used to be right, now wrong
          changeToLettersCorrect = -1;
          console.log('changeToLettersCorrect = -1')
        }
      }
      
      gridVals[row] && (gridVals[row][col] = value);
    
      // check if victory is achieved
      if (gridVals[0] && gridVals.length === this.state.goalGridValues.length && gridVals[0].length == this.state.goalGridValues[0].length) {
          let foundDiffference = false;
          for (var r = 0; r < this.props.grid.length; r++) {
              for(var c = 0; c < this.props.grid[0].length; c++) {
                  if (gridVals[r][c] != this.state.goalGridValues[r][c] && !(this.state.checkedLetters[r+','+c])) {
                      foundDiffference = true;
                  }
              }
          }
          if (!foundDiffference) {
              this.props.gameOver(this.state.lettersChecked, this.state.lettersCorrect);
              this.setState({
                victory: true,
                lettersChecked: 0,
                lettersCorrect: 0,
                focusedWordIndex: -1,
                focusedRowIndex: -1,
                focusedLetterIndex: -1,
                isCurrentFocusVertical: false,
                nextFocusIndex: [],
              })
          }
      }
      console.log('setting letters correct: ',this.state.lettersCorrect + changeToLettersCorrect)
      this.setState({gridValues: gridVals, lettersCorrect: this.state.lettersCorrect + changeToLettersCorrect});
    }
  }
  
  render() { 
    return (
      <View style={(window.height > 811 && window.width < 415) ? styles.tallGrid : (window.height < 810) ? styles.shortGrid :styles.grid}>
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
                      openActionSheet={this.openActionSheet}
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
    flex: 16,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  tallGrid: {
    flex: 12,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  shortGrid: {
    flex: 14,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  row: {
      flexDirection: 'row',
      width: '100%'
  }
});
