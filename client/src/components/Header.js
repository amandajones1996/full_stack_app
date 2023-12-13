import { useContext } from 'react';
import UserContext from '../context/UserContext';
import { Link } from 'react-router-dom';


function Header() {
    // if a user is authenticated display the users name on the header
    const { auth } = useContext(UserContext)
    
    return (
        <header>
            <div className="wrap header--flex">
                <h1 className="header--logo"><Link to="/">Courses</Link></h1>
                <nav>
                    {auth !== null ? 
                        <ul className="header--signedin">
                            <span>Welcome, {auth.firstName}! </span>
                            <Link to="/signout">Sign Out</Link>
                        </ul>
                     : 
                        <ul className="header--signedout">
                            <li><Link to="/signup">Sign Up</Link></li>
                            <li><Link to="/signin">Sign In</Link></li>
                        </ul>
                    }
                </nav>
            </div>
        </header>
    );
}

export default Header;