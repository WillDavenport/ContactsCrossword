export function generateCrossword(words = []) {
    var GRID_ROWS = 20;
    var GRID_COLS = 20;

    // eliminate words that are too long for grid
    words = words.filter(function(word) {
        return (word.text.length <= GRID_ROWS || word.text.length <= GRID_COLS);
    });
    console.log('words post filter: ', words)
    
    // build the grid;
    let grid = new Array(GRID_ROWS);
    for(var i = 0; i < GRID_ROWS; i++){
        grid[i] = new Array(GRID_COLS);	
    }

    // place first word in the center of the grid
    grid = placeWord(grid, words[0], ~~(GRID_ROWS/2) - ~~(words[0].text.length/2), ~~(GRID_COLS/2), true);

    for(var i=1; i<words.length; i++) {
        let wordPlaced = false;
        words[i].text.map((letter, index) => {
            for(var r = 0; r < GRID_ROWS && !wordPlaced; r++) {
                for(var c = 0; c < GRID_COLS && !wordPlaced; c++) {
                    if (grid[r][c]) {
                        if (letter == grid[r][c].letter) {
                            // found a match, check if we can place the word here
                            if (grid[r][c].verticalHint && !grid[r][c].horizontalHint) {
                                if(canPlaceWord(grid, words[i], r, c - index, true)) {
                                    grid = placeWord(grid, words[i], r, c - index, true);
                                    wordPlaced = true;
                                    //TODO move to next word
                                }
                            }
                            if (grid[r][c].horizontalHint && !grid[r][c].verticalHint) {
                                if(canPlaceWord(grid, words[i], r - index, c, false)) {
                                    grid = placeWord(grid, words[i], r - index, c, false);
                                    wordPlaced = true;
                                    //TODO move to next word
                                }
                            }
                        }
                    }
                }
            }
        })
    }
    console.log('grid after all word places: ', grid);
}

function placeWord(grid, word, indexRow, indexCol, isHorizontal) {
    let currRow = indexRow;
    let currCol = indexCol;
    
    word.text.map((letter, index) => {
        console.log('mapping word letter: ',letter)
        if(isHorizontal) {
            if(grid[currRow][currCol] == null) {
                grid[currRow][currCol] = {letter, horizontalHint: word.hint};
            } else {
                grid[currRow][currCol].horizontalHint = word.hint;
            }
            currCol++;

        } else {
            if(grid[currRow][currCol] == null) {
                grid[currRow][currCol] = {letter, verticalHint: word.hint};
            } else {
                grid[currRow][currCol].verticalHint = word.hint;
            }
            currRow++;
        }
    })
    return grid;
}

function canPlaceWord(grid, word, indexRow, indexCol, isHorizontal) {
    if(indexRow < 0 || indexCol < 0) {
        return false;
    }
    if(isHorizontal) {
        if (indexCol + word.text.length > grid[0].length) {
            return false;
        }
        if (grid[indexRow][indexCol - 1] || grid[indexRow][indexCol + word.text.length + 1]) {
            return false;
        }
        let currCol = indexCol;
        word.text.map((letter) => {
            if(!canPlaceLetter(grid, letter, indexRow, currCol, isHorizontal)) {
                return false;
            }
            currCol++;
        });
        return true;
    } 
    if (indexRow + word.text.length > grid.length) {
        return false;
    }
    if ((grid[indexRow -1] && grid[indexRow - 1][indexCol]) || (grid[indexRow+ word.text.length + 1] && grid[indexRow + word.text.length + 1][indexCol])) {
        return false;
    }
    let currRow = indexRow;
    word.text.map((letter) => {
        if(!canPlaceLetter(grid, letter, currRow, indexRow, isHorizontal)) {
            return false;
        }
        currRow++;
    });
    return true;
}

function canPlaceLetter(grid, letter, indexRow, indexCol, isHorizontal) {
    if (isHorizontal) {
        if (grid[indexRow][indexCol]) {
            if (grid[indexRow][indexCol].horizontalHint) {
                return false;
            }
            if (grid[indexRow][indexCol].letter == letter) {
                return true;
            }
        }
        else {
            // check either side so no jibberish is created
            if((grid[indexRow + 1] && grid[indexRow + 1][indexCol]) || (grid[indexRow - 1] && grid[indexRow - 1][indexCol])) {
                return false;
            }
            return true;
        }
    }
    if (grid[indexRow][indexCol]) {
        if (grid[indexRow][indexCol].verticalHint) {
            return false;
        }
        if (grid[indexRow][indexCol].letter == letter) {
            return true;
        }
    }
    else {
        // check either side so no jibberish is created
        if(grid[indexRow][indexCol + 1] || grid[indexRow][indexCol - 1]) {
            return false;
        }
        return true;
    }
}
