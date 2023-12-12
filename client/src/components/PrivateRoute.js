import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../context/UserContext';

const PrivateRoute = () => {
    const { auth } = useContext(UserContext);
    const location = useLocation();

    if(auth){
        return <Outlet />
    } else {
        return <Navigate to='/signin' state={{from: location.pathname }} />
    }
};

export default PrivateRoute;