import ResidenceList from "./ResidenceList";
import {Residence} from "../../app/models/residence";
import React, {useEffect, useState} from "react";
import agent from "../../app/api/agent";
import {useAppDispatch, useAppSelector} from "../../store/configureStore";
import {fetchResidencesAsync, residencesSelectors, setPageNumber, setResidenceParams} from "./catalogSlice";
import {Checkbox, FormControlLabel, FormGroup, Grid, Pagination, Paper} from "@mui/material";
import AppPagination from "../../app/components/AppPagination";
import LoadingComponent from "../../app/layout/LoadingComponent";

export default function Catalog(){
    const residences = useAppSelector(residencesSelectors.selectAll);
    const {residencesLoaded, metadata       } = useAppSelector(state => state.catalog);

    const handleInternet = (event: { target: { checked: any; }; }) => {
        if (event.target.checked) {
            dispatch(setResidenceParams({internet: true}))
        } else {
            dispatch(setResidenceParams({internet: null}))
        }
    };

    const handleAirCondition = (event: { target: { checked: any; }; }) => {
        if (event.target.checked) {
            dispatch(setResidenceParams({aircondition: true}))
        } else {
            dispatch(setResidenceParams({aircondition: null}))
        }
    };

    const handleKitchen = (event: { target: { checked: any; }; }) => {
        if (event.target.checked) {
            dispatch(setResidenceParams({kitchen: true}))
        } else {
            dispatch(setResidenceParams({kitchen: null}))
        }
    };

    const handleTv = (event: { target: { checked: any; }; }) => {
        if (event.target.checked) {
            dispatch(setResidenceParams({tv: true}))
        } else {
            dispatch(setResidenceParams({tv: null}))
        }
    };

    const handleParkingSpot = (event: { target: { checked: any; }; }) => {
        if (event.target.checked) {
            dispatch(setResidenceParams({parkingSpot: true}))
        } else {
            dispatch(setResidenceParams({parkingSpot: null}))
        }
    };

    const dispatch = useAppDispatch();
    useEffect(() => {
        if(!residencesLoaded) dispatch(fetchResidencesAsync());
    }, [residencesLoaded, dispatch]);

    if(!metadata) return <LoadingComponent message='Loading Products'/>

    return(
        <Grid container spacing={4}>
            <Paper sx={{ p: 3   , mb: 2, mt: 15}}>
                <Grid item xs={3}>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox onChange={handleInternet}/>} label="Internet" />
                        <FormControlLabel control={<Checkbox onChange={handleAirCondition}/>} label="AirCondition" />
                        <FormControlLabel control={<Checkbox onChange={handleKitchen}/>} label="Kitchen" />
                        <FormControlLabel control={<Checkbox onChange={handleTv}/>} label="Tv" />
                        <FormControlLabel control={<Checkbox onChange={handleParkingSpot}/>} label="Parking Spot" />
                    </FormGroup>
                </Grid>
            </Paper>
            <Grid item xs={9}>
                <ResidenceList residences={residences}/>
            </Grid>
            <Grid item xs={3} />
            <Grid item xs={9} sx={{mb: 2}}>
                <AppPagination
                    metadata={metadata}
                    onPageChange={(page:number) => dispatch(setPageNumber({pageNumber: page}))}
                />
            </Grid>
        </Grid>
    )

}