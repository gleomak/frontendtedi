import {Button, Fade, ListItem, Menu, MenuItem} from "@mui/material";
import React from "react";
import {useAppDispatch, useAppSelector} from "../../store/configureStore";
import {signOut} from "../../features/account/accountSlice";
import {NavLink} from "react-router-dom";

export default function SignedInMenu(){
    const dispatch = useAppDispatch();
    const {user} = useAppSelector(state => state.account);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>


            <Button
                color = 'inherit'
                onClick={handleClick}
                sx={{typography:'h6'}}
            >
                {user?.email}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
                <NavLink to={'/myProfile'} ><MenuItem onClick={handleClose}>Profile</MenuItem></NavLink>
                {user && user.roles?.includes('Host') &&
                    <NavLink to={'myResidences'}><MenuItem onClick={handleClose}> My Residences</MenuItem></NavLink>
                }
                {/*<MenuItem onClick={handleClose}>My account</MenuItem>*/}
                <MenuItem onClick={() => dispatch(signOut())}>Logout</MenuItem>
            </Menu>
        </>
    );
}