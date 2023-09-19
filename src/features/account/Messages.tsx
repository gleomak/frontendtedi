import {useAppDispatch, useAppSelector} from "../../store/configureStore";
import React, {useEffect, useState} from "react";

import {
    fetchMessagesAsync,
    fetchSpecificResidences,
    messagesSelectors,
    setMessageParams,
    setPageNumberMessages
} from "./accountSlice";
import LoadingComponent from "../../app/layout/LoadingComponent";
import {Grid, IconButton} from "@mui/material";
import AppPagination from "../../app/components/AppPagination";
import MessageCard from "./MessageCard";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import SearchIcon from "@mui/icons-material/Search";


export default function Messages() {
    const [previousMessages, setPreviousMessages] = useState(0);
    const [currentMessages, setCurrentMessages] = useState(0);
    const messages = useAppSelector(messagesSelectors.selectAll);
    const dispatch = useAppDispatch();
    const {messagesLoaded, metadata, messageParams} = useAppSelector(state => state.account);

    useEffect(()=>{
        dispatch(fetchMessagesAsync());
        // Fetch messages every 10 seconds
        const intervalId = setInterval(() => {
            dispatch(fetchMessagesAsync());
        }, 10000); // 10 seconds

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, [dispatch]);

    useEffect( ()=>{
        if(!messagesLoaded) dispatch(fetchMessagesAsync());
    },[messagesLoaded,dispatch]);

    if(!messagesLoaded || !metadata) return <LoadingComponent message='Loading Messages...'/>;

    return(
        <div>
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Search Residence Name"
                    value={messageParams.searchResidenceName}
                    onChange={(e) => dispatch(setMessageParams({searchResidenceName : e.target.value}))}
                />
                <Divider orientation="vertical" flexItem/>
                <IconButton onClick={() => dispatch(fetchSpecificResidences())}><SearchIcon/></IconButton>
            </div>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Grid container spacing={8} >
                            {messages.map(message => (
                                <Grid item xs={4} key={message.id}>
                                    <MessageCard key={message.id} message={message} />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container justifyContent="center" alignItems="center">
                            <AppPagination metadata={metadata} onPageChange={(page: number) => dispatch(setPageNumberMessages(page))} />
                        </Grid>
                    </Grid>
                </Grid>
        </div>
    )
}