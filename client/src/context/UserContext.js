import {callApi} from '../utils/callApi'
import { useState, createContext } from "react";

const UserContext = createContext(null);

export const UserProvider = (props) => {
    const [auth, setAuth] = useState(null)

    // sign in 
    const signIn = async (credentials) => {
        const resp = await callApi("/users", "GET", null, credentials);
        // if user returned -> update user state
        console.log(resp)
        if(resp.status === 200){
            let user = await resp.json();
            console.log(user)
            user.password = credentials.password;
            setAuth(user)
            console.log(auth)
            return user
        }else if(resp.status === 401){
            return null
        }else{
            throw new Error();
        }
    }

    // sign out
    const signOut = () => {
        setAuth(null);
    }

    return (
        <UserContext.Provider value={
            {
                auth: auth,
                actions: {
                    signIn, signOut
                }
            }
        }>
            {/* passing data to children components */}
            {props.children}
        </UserContext.Provider>
    );
}

export default UserContext;