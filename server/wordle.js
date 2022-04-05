class Wordle {
    constructor(row, col, wordle) {
        this.board = this.createMxNBoard(row, col)
        this.wordle = wordle
        this.maxRow = row
        this.maxCol = col
        this.curRow = 0
        this.curCol = 0
    }

    getRow() {
        return this.curRow
    }

    getDefaultBoxValues() {
        return {
            color: 'empty',
            letter: ''
        }
    }

    createMxNBoard(m, n) {
        return Array(m).fill().map(()=>Array(n).fill().map(() => this.getDefaultBoxValues()))
    }

    inAlphabet(key) {    
        const charCode = key.toUpperCase().charCodeAt(0)
        return (key.length === 1) && (charCode > 64) && (charCode < 91) 
    }
    
    convertBoardRowToString(boardRow) {
        return boardRow.map(col => col.letter).join('')
    }
    
    inWordList(boardRow, wordList) {
        return wordList.includes(this.convertBoardRowToString(boardRow).toLowerCase())
    }
    
    isWordle(boardRow, wordle) {
        return this.convertBoardRowToString(boardRow) === wordle.toUpperCase();
    }
    
    isDeletable() {
        return this.curCol > 0
    }
      
    hasFilledRow() {
        return this.curCol === this.maxCol
    }
      
    hasEmptyBox() {
        return this.curCol < this.maxCol
    }
    
    setGreenBoxes(map, boardRow, word) {
        for (let i = 0; i < boardRow.length; i++) {        
            if (boardRow[i].letter === word[i]) {
                boardRow[i].color = 'green'
                map.get(boardRow[i].letter).val--
            } 
        }
    }
    
    setYellowBoxes(map, boardRow) {
        for (let i = 0; i < boardRow.length; i++) {
            if (boardRow[i].color !== 'green' && map.has(boardRow[i].letter) && map.get(boardRow[i].letter).val > 0) {
                boardRow[i].color = 'yellow'
                map.get(boardRow[i].letter).val--
            }
        }
    }
    
    setGreyBoxes(boardRow) {
        for (let i = 0; i < boardRow.length; i++) {
            if (boardRow[i].color === 'empty') {
                boardRow[i].color = 'gray'
            }
        }
    }
    
    changeColorsInRow() {
        let boardRow = this.board[this.curRow]
        let word = this.wordle

        let map = new Map();
        for (let i = 0; i < word.length; i++) {
            if (!map.has(word[i])) {
                map.set(word[i], {val: 1})
            } else {
                map.get(word[i]).val++
            }
        }
        this.setGreenBoxes(map, boardRow, word)
        this.setYellowBoxes(map, boardRow)
        this.setGreyBoxes(map, boardRow)
    }

    moveToNextCol() {
        this.curCol += 1
    }

    moveToNextRow() {
        this.curRow += 1
        this.curCol = 0
    }

    moveToPrevCol() {
        this.curCol -= 1
    }

    addKeyToBoard(inputKey) {
        this.board[this.curRow][this.curCol].letter = inputKey
    }

    removePrevKeyFromBoard() {
        this.board[this.curRow][this.curCol - 1].letter = ''
    }

    accept(inputKey) {
        if (this.inAlphabet(inputKey) && this.hasEmptyBox()) {
            this.addKeyToBoard(inputKey)
            this.moveToNextCol()
        } else if (inputKey === 'ENTER') {
            if (!this.hasFilledRow()) {
                console.log("HAS NOT FILLED ROW")
                // setNotification({visible: true, message: 'Not enough letters'})
            }

            // if (!inWordList(newBoard[row.current], wordList)) {
            //     console.log("NOT IN WORD LIST")
            //     // setNotification({visible: true, message: 'Not in word list'})
            // }

            this.changeColorsInRow()
            // checkWinConditions(board)
            this.moveToNextRow()
        } else if ((inputKey === 'BACKSPACE' || inputKey === 'DELETE') && this.isDeletable()) {
            this.removePrevKeyFromBoard()
            this.moveToPrevCol()
        }
    }

    getBoard() {
        return this.board
    }

}



module.exports = Wordle