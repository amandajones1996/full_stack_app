import { useState, useRef, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { callApi } from '../utils/callApi';
import UserContext from '../context/UserContext';

function UserSignUp() {
    const emailAddress = useRef(null);
    const password = useRef(null);
    const firstName = useRef(null);
    const lastName = useRef(null);
    const navigate = useNavigate();
    const { actions } = useContext(UserContext);
    const [errors, setErrors] = useState([]);

    const handleCancel = (e) => {
        e.preventDefault();
        navigate('/');
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            firstName: firstName.current.value,
            lastName: lastName.current.value,
            emailAddress: emailAddress.current.value,
            password: password.current.value
        }
        try {
            const resp = await callApi('/users', 'POST', user);
            if(resp.status === 201){
                console.log(`${user.firstName} has been signed in.`);
                await actions.signIn(user);
            
                navigate('/');
            } else if(resp.status === 400){
                const errorData = await resp.json();
                setErrors(errorData.errors)
            } else {
                throw new Error();
            }
        } catch (e) {
            console.log(`Error: ${e}`);
        }
    };

    return (
        <div className="form--centered">
            <h2><strong>Sign Up</strong></h2>
            { errors.length ?
                    <div className="validation--errors">
                        <h3>Validation Errors</h3>
                        <ul>
                        {errors.map((error) => <li>{error}</li>)}
                        </ul>
                    </div>
                    : null
                }
                <br />
                    <div>
                        <form onSubmit={handleSubmit}>
                            <label >First Name</label>
                            <input id="firstName" name="firstName" type="text" ref={firstName} />
                            <label >Last Name</label>
                            <input id="lastName" name="lastName" type="text" ref={lastName} />
                            <label >Email Address</label>
                            <input id="emailAddress" name="emailAddress" type="email" ref={emailAddress}  />
                            <label >Password</label>
                            <input id="password" name="password" type="password" ref={password}  />
                            <button className="button" type="submit">Sign Up</button>
                            <button className="button button-secondary" onClick={handleCancel}>Cancel</button>
                        </form>
                    </div>
                <br />
            <p>Already have a user account? Click here to <Link to="/signin">sign in</Link>!</p>
        </div>
    );
}

export default UserSignUp;