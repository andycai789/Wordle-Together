import '../css/Header.css';
import {Link} from "react-router-dom";


const Header = () => {
    return (
        <div className='Header'>
            <Link id='headerLink' to='/'> Wordle </Link>
        </div>
    );
}

export default Header;

