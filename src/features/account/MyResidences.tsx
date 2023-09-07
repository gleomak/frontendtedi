import {useEffect, useState} from "react";
import {Residence} from "../../app/models/residence";
import {Metadata} from "../../app/models/metadata";
import agent from "../../app/api/agent";
import Grid from "@mui/material/Grid";
import MyResidenceCard from "./MyResidenceCard";


export default function MyResidences(){
    const [Residences, setResidences] = useState<Residence[]>([]);
    const [metadata, setMetadata] = useState<Metadata>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [areResidencesLoaded, setAreResidencesLoaded] = useState<boolean>(false);

    const reloadResidences = () =>{
        setAreResidencesLoaded(false);
    }

    useEffect( () =>{
       if(!areResidencesLoaded){
           const FetchResidences = async()=> {
               const params = new URLSearchParams();
               params.append('pageNumber', pageNumber.toString());
               params.append('pageSize', pageSize.toString());
               try {
                   const response = await agent.Account.getUserResidences(params);
                   setResidences(response.items);
                   setMetadata(response.metadata);
                   setAreResidencesLoaded(true);
               }catch (e) {
                   console.error('Error Fetching Residences',e);
               }
           }
           FetchResidences();
       }
    }, [areResidencesLoaded]);

    return(
        <div>
            {Residences.length > 0 ? (
                <Grid container spacing={4}>
                    {Residences.map(residence =>(
                        <Grid item xs={3} key={residence.id}>
                            <MyResidenceCard residence={residence} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <h2>Loading Residences...</h2>
            )}
        </div>
    );
};