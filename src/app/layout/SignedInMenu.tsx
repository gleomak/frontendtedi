import {Button, IconButton, Menu, MenuItem} from "@mui/material";
import React from "react";
import {useAppDispatch, useAppSelector} from "../../store/configureStore";
import {signOut} from "../../features/account/accountSlice";
import MessageIcon from '@mui/icons-material/Message';
import {Link, NavLink} from "react-router-dom";

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
            <IconButton component={Link} to="/messages" color="inherit" >
                <MessageIcon/>
            </IconButton>
            <Button
                color = 'inherit'
                onClick={handleClick}
                sx={{typography:'h6'}}
            >
                {user?.email}
            </Button>
            <Menu
                id="dropdown-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {user && user.roles?.includes('Host') && [
                    <NavLink key="myResidences" to="/myResidences">
                        <MenuItem onClick={handleClose}>My Residences</MenuItem>
                    </NavLink>,
                    <NavLink key="createResidence" to="/createResidence">
                        <MenuItem onClick={handleClose}>Create Residence</MenuItem>
                    </NavLink>,
                ]}
                <NavLink to={'/myProfile'} ><MenuItem onClick={handleClose}>Profile</MenuItem></NavLink>
                <MenuItem onClick={() => dispatch(signOut())}>Logout</MenuItem>
            </Menu>
        </>
    );
}