import '../css/Header.css';
import {useNavigate} from "react-router-dom";

const Header = () => {
    const navigate = useNavigate()

    const handleOnClick = () => {
        navigate('/', {replace: true})
        window.location.reload(true);
    }

    return (
        <div className='Header'>
            <button id='headerLink' onClick={handleOnClick}> Wordle </button>
        </div>
    );
}

export default Header;

