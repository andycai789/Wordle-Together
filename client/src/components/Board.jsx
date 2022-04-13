import Row from './Row.jsx'
import '../css/Board.css'

const Board = ({board}) => {
    return (
        <div className="boardContainer">
            <div className="board">
                {board.map((row, index) => <Row key={index} row={row} />)}
            </div>
        </div>
    )
}

export default Board