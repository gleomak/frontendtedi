import {Grid} from "@mui/material";
import {Residence} from "../../app/models/residence";
import ResidenceCard from "./ResidenceCard";

interface Props{
    residences: Residence[];
}
export default function ResidenceList({residences}: Props){
    return(
        <Grid container spacing={4}>
            {residences.map(residence =>(
                <Grid item xs={4} key={residence.id}>
                    <ResidenceCard key={residence.id} residence={residence}/>
                </Grid>
            ))}
        </Grid>
    )
}