import '../css/Header.css';
import {Link} from "react-router-dom";


const Header = () => {
    return (
        <div className='Header'>
            <Link id='headerLink' to='/'> WORDLE WITH FRIENDS </Link>
        </div>
    );
}

export default Header;

