class Wordle {
    constructor({rows, cols, word, wordList}) {
        this.board = this.createMxNBoard(rows, cols)
        this.word = word
        this.maxRow = rows
        this.maxCol = cols
        this.curRow = 0
        this.curCol = 0
        this.wordList = new Set(wordList)
        this.endGameStatus = false
    }

    getRow() {
        return this.curRow
    }

    getCol() {
        return this.curCol
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

    convertBoardRowToString(boardRow) {
        return boardRow.map(col => col.letter).join('')
    }

    inAlphabet(key) {    
        const charCode = key.toUpperCase().charCodeAt(0)
        return (key.length === 1) && (charCode > 64) && (charCode < 91) 
    }

    inWordList() {
        return this.wordList.has(this.convertBoardRowToString(this.board[this.curRow]).toLowerCase())
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
        let word = this.word

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
        this.setGreyBoxes(boardRow)
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

    isEndGame() {
        return this.endGameStatus
    }

    isVictory() {
        return this.convertBoardRowToString(this.board[this.curRow - 1]) === 
                this.word.toUpperCase();
    }

    isDefeat() {
        return this.curRow === this.maxRow
    
    }

    getBoard() {
        return this.board
    }

    accept(inputKey) {
        if (this.inAlphabet(inputKey) && this.hasEmptyBox()) {
            this.addKeyToBoard(inputKey)
            this.moveToNextCol()
        } else if (inputKey === 'ENTER') {
            if (!this.hasFilledRow()) {
                return {win: false}
            }

            if (!this.inWordList()) {
                return {win: false}
            }

            this.changeColorsInRow()
            this.moveToNextRow()

            if (this.isVictory()) {
                this.endGameStatus = true
                return {endGame: true, win: true}
            } else if (this.isDefeat()) {
                this.endGameStatus = true
                return {endGame: true, win: false}
            }
        } else if ((inputKey === 'BACKSPACE' || inputKey === 'DELETE') && this.isDeletable()) {
            this.removePrevKeyFromBoard()
            this.moveToPrevCol()
        }

        return {endGame: false, message: ''}
    }
}



module.exports = Wordle