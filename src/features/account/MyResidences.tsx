import React, {useEffect, useState} from "react";
import {Residence} from "../../app/models/residence";
import {Metadata} from "../../app/models/metadata";
import agent from "../../app/api/agent";
import Grid from "@mui/material/Grid";
import MyResidenceCard from "./MyResidenceCard";
import LoadingComponent from "../../app/layout/LoadingComponent";
import AppPagination from "../../app/components/AppPagination";
import {setPageNumberMessages} from "./accountSlice";


export default function MyResidences(){
    const [Residences, setResidences] = useState<Residence[]>([]);
    const [metadata, setMetadata] = useState<Metadata>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageSize] = useState<number>(10);
    const [areResidencesLoaded, setAreResidencesLoaded] = useState<boolean>(false);

    const reloadResidences = () =>{
        setAreResidencesLoaded(false);
    }

    useEffect(() => {
        setAreResidencesLoaded(false);
    }, [pageNumber]);

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
    }, [areResidencesLoaded, pageNumber, pageSize]);

    if(!areResidencesLoaded || !metadata) return <LoadingComponent message='Loading Host Residences...'/>

    return(

        <div>
            {Residences.length > 0 ? (
                <Grid>
                    <Grid container spacing={4}>
                        {Residences.map(residence =>(
                            <Grid item xs={3} key={residence.id}>
                                <MyResidenceCard residence={residence} reloadResidences={reloadResidences}/>
                            </Grid>
                        ))}
                    </Grid>
                    <Grid>
                        <Grid container justifyContent="center" alignItems="center">
                            <AppPagination metadata={metadata} onPageChange={(page: number) => setPageNumber(page)} />
                        </Grid>
                    </Grid>
                </Grid>
            ) : (
                <h2>No residences....</h2>
            )}
        </div>
    );
};