import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {Paper} from "@mui/material";
import {Link, useNavigate} from 'react-router-dom';
import {useState} from "react";
import agent from "../../app/api/agent";
import {FieldValue, FieldValues, useForm} from "react-hook-form";
import {useAppDispatch} from "../../store/configureStore";
import {setUser, signInUser} from "./accountSlice";


// // TODO remove, this demo shouldn't need to reset the theme.
// const defaultTheme = createTheme();

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const{register, handleSubmit,
        formState:{isSubmitting, errors, isValid}} = useForm()

    async function submitForm(data:FieldValues){
        const user = await dispatch(signInUser(data));
        // dispatch(state => setUser(user));
        navigate('/catalog');
    }

    return (
            <Container component={Paper} maxWidth="sm" sx={{display : 'flex', flexDirection: 'column', alignItems: 'center', p:4}}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit(submitForm)} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Username"
                        autoFocus
                        {...register('username', {required: 'Username is required!'})}
                        error={!!errors.username}
                        helperText = {errors?.username?.message as string}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Password"
                        type="password"
                        {...register('password', {required : 'Password is required!'})}
                        error={!!errors.password}
                        helperText = {errors?.password?.message as string}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link to='/register' >
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
    );
}