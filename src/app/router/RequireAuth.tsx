import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {useAppSelector} from "../../store/configureStore";
import {useEffect, useState} from "react";

interface Props {
    roles?: string[];
}

export default function RequireAuth({roles}: Props) {
    const {user} = useAppSelector(state => state.account);
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true); // Initial loading state
    const delayMilliseconds = 500; // Adjust the delay time as needed

    useEffect(() => {
        // Simulate a delay before fetching the user data
        setTimeout(() => {
            setIsLoading(false); // Set loading state to false after the delay
        }, delayMilliseconds);
    }, []);

    if (isLoading) {
        return <h2>Waiting user...</h2>; // Display a message while waiting
    }

    if (!user) {
        return <Navigate to='/login' state={{from: location}} />
    }

    if (roles && !roles.some(r => user.roles?.includes(r))) {
        toast.error('Not authorised to access this area');
        return <Navigate to='/catalog' />
    }

    return <Outlet />
}