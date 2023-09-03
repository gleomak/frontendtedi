import {useAppDispatch, useAppSelector} from "../../store/configureStore";
import { resignOut} from "./accountSlice";
import agent from "../../app/api/agent";
import { useState} from "react";
import {Input, InputLabel, Paper} from "@mui/material";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import Container from "@mui/material/Container";
import * as React from "react";
import {FieldValues, useForm} from "react-hook-form";
import {toast} from "react-toastify";


export default function MyProfile(){
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.account.user);
    const navigate = useNavigate();
    const{register, handleSubmit, setError,
        formState:{ errors}} = useForm({
        defaultValues: {
            firstName : user?.firstName,
            lastName  : user?.lastName,
            username  : user?.username,
            streetAddress : user?.streetAddress,
            email : user?.email,
            phoneNumber : user?.phoneNumber,
            password : '',
            newPassword : '',
            file : null,
            role : user?.roles
        }
    });

    function handleApiErrors(errors: any) {
        console.log(errors);
        if(errors){
            errors.forEach((error: string, index: number) => {
                if (error.includes('Current Password')) {
                    setError('password', {message: error})
                }else if (error.includes('New Password')) {
                    setError('newPassword', {message: error})
                } else if (error.includes('First Name')) {
                    setError('firstName', { message: error })
                } else if (error.includes('Last Name')) {
                    setError('lastName', { message: error })
                } else if (error.includes('Phone Number')) {
                    setError('phoneNumber', { message: error })
                } else if (error.includes('Street Address')) {
                    setError('streetAddress', { message: error })
                }else if (error.includes('Username')) {
                    setError('username', {message: error})
                }else if (error.includes('Email')) {
                    setError('email', {message: error})
                }
            });
        }
    }

    async function handleUpdateSubmit(data: FieldValues){
        const formData = new FormData();
        formData.append('firstName', data.firstName);
        formData.append('lastName', data.lastName);
        formData.append('username', data.username);
        formData.append('email', data.email);
        formData.append('password', data.password);
        if(data.newPassword.isNull){
            formData.append('newPassword', '');
        }else{
            formData.append('newPassword', data.newPassword);
        }
        formData.append('streetAddress', data.streetAddress);
        formData.append('phoneNumber', data.phoneNumber);
        if(data.file != null){
            formData.append('file',data.file[0])
        }else{
            formData.append('file', data.file);
        }
        formData.append('role', data.role);
        agent.Account.editUserProfile(formData)
            .then(() => {
                toast.success('Update successful, you can now re-Login!')
                dispatch(() => dispatch(resignOut()));
                navigate('/login');
            })
            .catch(errors => handleApiErrors(errors))
    }

    const defaultProfileImageUrl = "blank-profile-picture-973460_1280.png" ;
    if(!user) return <h3>Loading....</h3>
    return(
        <Container component={Paper} maxWidth="sm" sx={{display : 'flex', flexDirection: 'column', alignItems: 'center', p:4}}>
            {user.pictureURL ? (
                <img
                    src={user.pictureURL}
                    alt="User Profile"
                    style={{ width: "150px", height: "150px" }}
                />
            ) : (
                <img
                    src={defaultProfileImageUrl}
                    alt="Default Profile"
                    style={{ width: "150px", height: "150px" }}
                />
            )}
            <Box component="form"
                 onSubmit={handleSubmit(handleUpdateSubmit)}
                 noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    fullWidth
                    label="First Name"
                    // value = {user.firstName}
                    autoFocus
                    {...register('firstName', {required: 'First name is required!'})}
                    error={!!errors.firstName}
                    helperText={errors?.firstName?.message as string}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Last Name"
                    // value = {user.lastName}
                    autoFocus
                    {...register('lastName', {required: 'Last name is required!'})}
                    error={!!errors.lastName}
                    helperText={errors?.lastName?.message as string}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Username"
                    // value = {user.username}
                    autoFocus
                    InputProps={{
                        readOnly: true,
                    }}
                    {...register('username', {required: 'Username is required!'})}
                    error={!!errors.username}
                    helperText = {errors?.username?.message as string}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Email"
                    autoFocus
                    InputProps={{
                        readOnly: true,
                    }}
                    {...register('email', {
                        required: 'Email is required!',
                        pattern:{
                            value: /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/,
                            message: 'Not a valid email address'
                        }
                    })}
                    error={!!errors.email}
                    helperText = {errors?.email?.message as string}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Street Address"
                    autoFocus
                    {...register('streetAddress', {required: 'Street Address is required!'})}
                    error={!!errors.streetAddress}
                    helperText={errors?.streetAddress?.message as string}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Phone Number"
                    autoFocus
                    {...register('phoneNumber', {required: 'Phone number is required!'})}
                    error={!!errors.phoneNumber}
                    helperText={errors?.phoneNumber?.message as string}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Current Password"
                    type="password"
                    {...register('password', {
                        required : 'Password is required!',
                        pattern:{

                            value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/,
                            message: 'Password does not meet complexity requirements'
                        }
                    })}
                    error={!!errors.password}
                    helperText = {errors?.password?.message as string}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="New Password"
                    type="password"
                    {...register('newPassword', {
                        pattern:{
                            value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/,
                            message: 'Password does not meet complexity requirements'
                        }
                    })}
                    error={!!errors.newPassword}
                    helperText = {errors?.newPassword?.message as string}
                />
                <InputLabel htmlFor="first-name-input">Profile picture</InputLabel>
                <Input
                    {...register("file")}
                    type="file"
                />
                <label>Role Selection</label>
                <select {...register("role")} >
                    <option value="Host">Host</option>
                    <option value="Member">Member</option>
                    <option value="Host/Member">Host/Member</option>
                </select>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Update Details
                </Button>
            </Box>
        </Container>
    );
}