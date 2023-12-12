import { useState, useContext, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import UserContext from '../context/UserContext';

function UserSignIn() {
    const [errors, setErrors] = useState([]);
    const emailAddress = useRef(null);
    const password = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { actions } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // keep track of users selected route
        let from = '/';
        if(location.state){
            from = location.state.from;
        }

        const credentials = {
            emailAddress: emailAddress.current.value,
            password: password.current.value
        }; 

        try {
            const user = await actions.signIn(credentials);
            if(user){
                navigate(from);
            } else {
                setErrors(["Sign in failed"])
            }
        } catch (e) {
            console.log(`Error: ${e}`)
        }
    };

    const handleCancel = (e) => {
        e.preventDefault();
        navigate('/');
    }

    return (
        <div className="form--centered">
            <h2>Sign In</h2>
            <div>{errors}</div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="emailAddress">Email Address</label>
                <input id="emailAddress" name="emailAddress" type="email" ref={emailAddress} />
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" ref={password} />
                <button className="button" type="submit">Sign In</button><button className="button button-secondary" onClick={handleCancel}>Cancel</button>
            </form>
            <p>Don't have a user account? Click here to <Link to="/signup">sign up</Link>!</p>
        </div>
    );
}

export default UserSignIn;