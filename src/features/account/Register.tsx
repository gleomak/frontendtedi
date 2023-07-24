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
import {useForm} from "react-hook-form";
import {useAppDispatch} from "../../store/configureStore";
import agent from "../../app/api/agent";
import {useState} from "react";


// // TODO remove, this demo shouldn't need to reset the theme.
// const defaultTheme = createTheme();

export default function Register() {
    const{register, handleSubmit, setError,
        formState:{isSubmitting, errors, isValid}} = useForm()

    function handleApiErrors(response: any) {
        const errors = Object.values(response.errors).flat();
        console.log();
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
                 onSubmit={handleSubmit(data =>
                     agent.Account.register(data)
                         // .catch(response => handleApiErrors(response))
                     )}
                 noValidate sx={{ mt: 1 }}>
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
                    label="Email"
                    // autoFocus
                    {...register('email', {required: 'Email is required!'})}
                    error={!!errors.email}
                    helperText = {errors?.email?.message as string}
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