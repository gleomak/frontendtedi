import Typography from "@mui/material/Typography";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Grid} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../store/configureStore";
import {fResidenceAsync, residencesSelectors} from "./catalogSlice";


export default function ResidenceDetails(){
    const dispatch = useAppDispatch();
    const{id} = useParams<{id: string}>();
    const residence  = useAppSelector(state => residencesSelectors.selectById(state,id!));
    const {status: residenceStatus} = useAppSelector(state => state.catalog);
    useEffect(() =>{
        if(!residence) dispatch(fResidenceAsync(parseInt(id!)));
    }, [id, dispatch, residence])

    if(residenceStatus.includes('pending')) return <h3>Loading...</h3>
    if(!residence) return <h3>Product not found</h3>

    return(
        <Grid container spacing={6}>
            {/*<Grid item xs={6}>*/}
            {/*    <img src={residence.imageURL}  alt={residence.description} style={{width:100}} />*/}
            {/*</Grid>*/}
            {/*<Grid item xs={6}>*/}
                <Typography variant='h3'>
                    {residence.id}
                </Typography>
            {/*</Grid>*/}
        </Grid>
    )
}