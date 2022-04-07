import '../css/Header.css';
import {Link} from "react-router-dom";


const Header = () => {
    return (
        <div className='Header'>
            <Link id='headerLink' to='/'> Wordle with Friends </Link>
        </div>
    );
}

export default Header;

