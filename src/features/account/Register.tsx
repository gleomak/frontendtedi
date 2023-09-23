import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {Input, InputLabel, Paper} from "@mui/material";
import {Link, useNavigate} from 'react-router-dom';
import {FieldValues, useForm} from "react-hook-form";
import {useAppDispatch} from "../../store/configureStore";
import agent from "../../app/api/agent";
import {useState} from "react";
import {toast} from "react-toastify";
import "./Register.css"

export default function Register() {
    const navigate = useNavigate();
    const{register, handleSubmit, setError, watch, getValues,
        formState:{errors}} = useForm({
        mode: 'onTouched'
    });

    function handleApiErrors(errors: any) {
        console.log(errors);
        if(errors){
            errors.forEach((error: string, index: number) => {
                if (error.includes('Password')) {
                    setError('password', { message: error })
                } else if (error.includes('Email')) {
                    setError('email', { message: error })
                } else if (error.includes('First Name')) {
                    setError('firstName', { message: error })
                } else if (error.includes('Last Name')) {
                    setError('lastName', { message: error })
                } else if (error.includes('Phone Number')) {
                    setError('phoneNumber', { message: error })
                } else if (error.includes('Street Address')) {
                    setError('streetAddress', { message: error })
                } else if (error.includes('Username')) {
                    setError('username', { message: error })
                }else if (error.includes('role')) {
                    setError('role', { message: error })
                }
            });
        }
    }

    async function handleRegisterSubmit(data: FieldValues){
        const formData = new FormData();
        formData.append('firstName', data.firstName);
        formData.append('lastName', data.lastName);
        formData.append('username', data.username);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('streetAddress', data.streetAddress);
        formData.append('phoneNumber', data.phoneNumber);
        formData.append('file',data.file[0]);
        formData.append('role', data.role);
        agent.Account.register(formData)
            .then(() => {
                toast.success('Registration successful, you can now Login!');
                if(data.role === "Host" || data.role === "Host/Member")
                    toast.success("Waiting Admin authorization!")
                navigate('/login');
            })
            .catch(errors => handleApiErrors(errors))
    }

    return (
        <Container component={Paper} maxWidth="sm" sx={{display : 'flex', flexDirection: 'column', alignItems: 'center', p:4}}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Register
            </Typography>
            <Box component="form"
                 onSubmit={handleSubmit(handleRegisterSubmit)}
                 noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    fullWidth
                    label="First Name"
                    // autoFocus
                    {...register('firstName', {required: 'First name is required!'})}
                    error={!!errors.firstName}
                    helperText={errors?.firstName?.message as string}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Last Name"
                    // autoFocus
                    {...register('lastName', {required: 'Last name is required!'})}
                    error={!!errors.lastName}
                    helperText={errors?.lastName?.message as string}
                />

                <TextField
                    margin="normal"
                    fullWidth
                    label="Username"
                    // autoFocus
                    {...register('username', {required: 'Username is required!'})}
                    error={!!errors.username}
                    helperText = {errors?.username?.message as string}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Email"
                    // autoFocus
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
                    // autoFocus
                    {...register('streetAddress', {required: 'Street Address is required!'})}
                    error={!!errors.streetAddress}
                    helperText={errors?.streetAddress?.message as string}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Phone Number"
                    // autoFocus
                    {...register('phoneNumber', {required: 'Phone number is required!'})}
                    error={!!errors.phoneNumber}
                    helperText={errors?.phoneNumber?.message as string}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Password"
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
                    label="Repeat Password"
                    type="password"
                    {...register("password_repeat", { required: true })}
                />
                {watch("password_repeat") !== watch("password") &&
                getValues("password_repeat") ? (
                    <div className="error_message">
                        <p>Passwords don't match</p>
                    </div>
                ) : null}
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
                    Register
                </Button>
                <Grid container>
                    <Grid item>
                        <Link to='/login' >
                            {"Already have an account? Sign In!"}
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}