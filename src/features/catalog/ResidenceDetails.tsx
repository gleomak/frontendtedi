import Typography from "@mui/material/Typography";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {Residence} from "../../app/models/residence";
import {Grid} from "@mui/material";
import agent from "../../app/api/agent";


export default function ResidenceDetails(){
    const{id} = useParams<{id: string}>();
    const [residence, setResidence] = useState<Residence | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        id && agent.Catalog.details(parseInt(id))
        // axios.get(`http://localhost:5000/api/Residences/${id}`)
            .then(response => setResidence(response))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }, [id])

    if(loading) return <h3>Loading...</h3>
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