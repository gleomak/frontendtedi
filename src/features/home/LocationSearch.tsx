import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { DatePicker } from "@mui/x-date-pickers";
import SearchIcon from '@mui/icons-material/Search';
import {catalogSlice, setFromDate, setResidenceParams, setResidencesLoaded} from "../catalog/catalogSlice";
import {useAppDispatch, useAppSelector} from "../../store/configureStore";
import TextField from "@mui/material/TextField";
import {MenuItem} from "@mui/material";
import {NavLink} from "react-router-dom";

const LocationSearch = () => {
    const { residenceParams } = useAppSelector(state => state.catalog);
    const [guests, setGuests] = useState(1); // Initial number of guests
    const dispatch = useAppDispatch();
    const handleChange = (event : any) => {
        setGuests(event.target.value);
        dispatch(setResidenceParams({numOfPeople : event.target.value}));
    };
    const generateGuestOptions = () => {
        const options = [];
        for (let i = 1; i <= 10; i++) {
            options.push(
                <MenuItem key={i} value={i}>
                    {i}
                </MenuItem>
            );
        }
        return options;
    };

    return (
        <Paper
            sx={{
                borderRadius: 50,
                ml: -20,
                mr: -20,
                display: 'flex',
                alignItems: 'center', // Align items vertically in the center
                justifyContent: 'space-around', // Distribute items evenly along the horizontal axis
                padding: '10px 20px', // Add padding for spacing
            }}
            elevation={3}
        >
            {/* Anywhere */}
            <TextField id="standard-basic"
                       label="City"
                       variant="standard"
                       onChange={event=>dispatch(setResidenceParams({city : event.target.value}))}/>
            <Divider orientation="vertical" flexItem />

            {/* Neighborhood */}
            <TextField id="standard-basic"
                       label="Neighborhood"
                       variant="standard"
                       onChange={event=>dispatch(setResidenceParams({neighborhood : event.target.value}))}
            />

            <Divider orientation="vertical" flexItem />

            {/* Country */}
            <TextField id="standard-basic"
                       label="Country"
                       variant="standard"
                       onChange={event=>dispatch(setResidenceParams({country : event.target.value}))}
            />
            {/* From */}
            <Divider orientation="vertical" flexItem />
            <DatePicker
                label = "Holidays Starting From"
                format="DD/MM/YYYY"
                onChange={(newDate : any) => {
                    const serializedDate = newDate.toISOString();
                    dispatch(setResidenceParams({ from: serializedDate }))}}
            />

            {/* To */}
            <Divider orientation="vertical" flexItem />
            <DatePicker label="Holidays Ending On"
                format="DD/MM/YYYY"
                        onChange={(newDate : any) => {
                            const serializedDate = newDate.toISOString();
                            dispatch(setResidenceParams({ to: serializedDate }))}}
            />

            {/* Add guests */}
            <Divider orientation="vertical" flexItem />
            <FormControl sx={{ minWidth: 120 }}>
                <InputLabel sx={{ marginTop: '8px' }}>Guests</InputLabel>
                <Select
                    value={guests}
                    onChange={handleChange}

                >
                    {generateGuestOptions()}
                </Select>
            </FormControl>
            <Divider orientation="vertical" flexItem />
            <NavLink to={'/catalog'} >
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SearchIcon />}
                >
                    Search
                </Button>
            </NavLink>
        </Paper>
    );
};

export default LocationSearch;