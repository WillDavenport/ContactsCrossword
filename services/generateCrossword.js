export function generateCrossword(words = [], GRID_ROWS = 14, GRID_COLS = 10) {
    var gridRows = GRID_ROWS;
    var gridColumns = GRID_COLS;

    // eliminate words that are too long for grid
    words = words.filter(function(word) {
        return (word.text.length <= gridRows && word.text.length <= gridColumns);
    });
    
    // build the grid;
    let grid = new Array(gridRows);
    for(var r = 0; r < gridRows; r++){
        grid[r] = new Array(gridColumns);
        for(var c = 0; c < gridColumns; c++) {
            grid[r][c] = {};
        }
    }

    // place first word in the center of the grid
    grid = placeWord(grid, words[0], 0, ~~(gridRows/2), ~~(gridColumns/2)- ~~(words[0].text.length/2), true);

    for(var i=1; i<words.length; i++) {
        let wordPlaced = false;
        words[i].text.map((letter, index) => {
            for(var r = 0; r < gridRows && !wordPlaced; r++) {
                for(var c = 0; c < gridColumns && !wordPlaced; c++) {
                    if (grid[r][c].letter) {
                        if (letter == grid[r][c].letter) {
                            // found a match, check if we can place the word here
                            if (grid[r][c].verticalWordIndex != null && grid[r][c].horizontalWordIndex == null) {
                                if(canPlaceWord(grid, words[i], r, c - index, true)) {
                                    grid = placeWord(grid, words[i], i, r, c - index, true);
                                    wordPlaced = true;
                                    //TODO move to next word
                                }
                            }
                            if (grid[r][c].horizontalWordIndex != null && grid[r][c].verticalWordIndex == null) {
                                if(canPlaceWord(grid, words[i], r - index, c, false)) {
                                    grid = placeWord(grid, words[i], i, r - index, c, false);
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

    // remove unused rows
    for(var r = gridRows - 1; r >= 0; r--) {
        let rowUsed = false;
        for(var c = 0; c < gridColumns; c++) {
            if (grid[r][c].letter) {
                rowUsed = true;
            }
        }
        if (!rowUsed) { // remove row
            grid.splice(r, 1);
            gridRows--;
        }
    }

    // remove unused columns
    for(var c = gridColumns - 1; c >= 0; c--) {
        let colUsed = false;
        for(var r = 0; r < gridRows; r++) {
            if (grid[r][c].letter) {
                colUsed = true;
            }
        }
        if (!colUsed) { // remove column
            for(var r = 0; r < gridRows; r++) {      
                grid[r].splice(c,1);
            }
            gridColumns--;
        }
    }
    //console.log('grid after trim: ', grid);

    return grid;
}

function placeWord(grid, word, i, indexRow, indexCol, isHorizontal) {
    let currRow = indexRow;
    let currCol = indexCol;
    
    word.text.map((letter, index) => {
        if(isHorizontal) {
            if(!grid[currRow][currCol].letter) {
                grid[currRow][currCol] = {letter, horizontalWordIndex: i};
            } else {
                grid[currRow][currCol].horizontalWordIndex = i;
            }
            currCol++;

        } else {
            if(!grid[currRow][currCol].letter) {
                grid[currRow][currCol] = {letter, verticalWordIndex: i};
            } else {
                grid[currRow][currCol].verticalWordIndex = i;
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
        if ((grid[indexRow][indexCol - 1] && grid[indexRow][indexCol - 1].letter) || (grid[indexRow][indexCol + word.text.length] && grid[indexRow][indexCol + word.text.length].letter)) {
            return false;
        }
        let currCol = indexCol;
        for(var l =0; l<word.text.length; l++) {
            if(!canPlaceLetter(grid, word.text[l], indexRow, currCol, isHorizontal)) {
                return false;
            }
            currCol++;
        }
        return true;
    } 
    if (indexRow + word.text.length > grid.length) {
        return false;
    }
    if ((grid[indexRow -1] && grid[indexRow - 1][indexCol].letter) || (grid[indexRow+ word.text.length] && grid[indexRow + word.text.length][indexCol].letter)) {
        return false;
    }
    let currRow = indexRow;
    for(var l =0; l<word.text.length; l++) {
        if(!canPlaceLetter(grid, word.text[l], currRow, indexCol, isHorizontal)) {
            return false;
        }
        currRow++;
    }
    return true;
}

function canPlaceLetter(grid, letter, indexRow, indexCol, isHorizontal) {
    if (isHorizontal) {
        if (grid[indexRow][indexCol] && grid[indexRow][indexCol].letter) {
            if (grid[indexRow][indexCol].horizontalWordIndex) {
                return false;
            }
            if (grid[indexRow][indexCol].letter == letter) {
                return true;
            }
        }
        else {
            // check either side so no jibberish is created
            if((grid[indexRow + 1] && grid[indexRow + 1][indexCol] && grid[indexRow + 1][indexCol].letter) || (grid[indexRow - 1] && grid[indexRow - 1][indexCol] && grid[indexRow - 1][indexCol].letter)) {
                return false;
            }
            return true;
        }
    }
    if (grid[indexRow][indexCol] && grid[indexRow][indexCol].letter) {
        if (grid[indexRow][indexCol].verticalWordIndex) {
            return false;
        }
        if (grid[indexRow][indexCol].letter == letter) {
            return true;
        }
    }
    else {
        // check either side so no jibberish is created
        if((grid[indexRow][indexCol + 1] && grid[indexRow][indexCol + 1].letter) || (grid[indexRow][indexCol - 1] && grid[indexRow][indexCol - 1].letter)) {
            return false;
        }
        return true;
    }
}
