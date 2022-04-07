import {Link} from "react-router-dom";
import '../../css/LobbyPage.css';

const LobbyPage = ({socket, onSettingChange}) => {

    let setting = {rows: 3, cols: 7, wordle: 'GRAHAMS', wordList: []}

    return (
        <div>

            <div className="settings">

                {Array.from({length: 16}, (_, i) => <button> {i + 5}</button>)}
                {Array.from({length: 16}, (_, i) => <button> {i + 5}</button>)}

                make an exit


            </div>






            <Link to='/game' onClick={() => onSettingChange(setting)}> GO TO GAME </Link>

        </div>
    )
}

export default LobbyPage