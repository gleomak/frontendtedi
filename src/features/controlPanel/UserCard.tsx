import React from 'react';
import { Card, CardContent, Typography, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import {User} from "../../app/models/user";
import Button from "@mui/material/Button";
import agent from "../../app/api/agent";
import {toast} from "react-toastify";

interface Prop{
    user : User;
    onReloadUsers: () => void;
}

export default function UserCard({user, onReloadUsers}:Prop) {
    const defaultProfileImageUrl = "blank-profile-picture-973460_1280.png" ;
    const rolesString = user.roles!.join(', ');



    const handleClick = async () =>{
        const param = new FormData();
        param.append('username', user.username);
        await agent.Admin.authorizeUser(param).then(() => {
            toast.success("User in now Authorized")})
            .catch(errors => console.log(errors))
        onReloadUsers();
    };

    return (
        <Card >
            <CardContent>
                {user.pictureURL ? (
                        <img
                            src={user.pictureURL}
                            style={{ width: "60px", height: "60px" }}
                            alt="Profile"/>
                    ) : (
                        <img
                            src={defaultProfileImageUrl}
                            alt="Default Profile"
                            style={{ width: "60px", height: "60px" }}
                        />)}
                <Typography variant="h6" component="div">
                    {user.username}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    <strong>Name:</strong> {user.firstName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    <strong>Surname:</strong>{user.lastName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    <strong>Email:</strong> {user.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    <strong>Phone:</strong> {user.phoneNumber}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    <strong>Address:</strong> {user.streetAddress}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    <strong>Role/s:</strong> {rolesString}
                </Typography>
                <Button
                    variant="contained"
                    disabled={user.roleAuthorized}
                    onClick={handleClick}
                >
                    Authorize User
                </Button>
            </CardContent>
        </Card>
    );
};
