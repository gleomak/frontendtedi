import Typography from "@mui/material/Typography";
import { User } from "../../app/models/user";
import {useEffect, useState} from "react";
import agent from "../../app/api/agent";
import {Metadata} from "../../app/models/metadata";
import {Grid, MenuItem, Paper, Select} from "@mui/material";
import UserCard from "./UserCard";
import Button from "@mui/material/Button";
import AppPagination from "../../app/components/AppPagination";
import LoadingComponent from "../../app/layout/LoadingComponent";
import axios from "axios";
import {toast} from "react-toastify";

export default function ControlPanel(){
    const [users, setUsers] = useState<User[]>([]);
    const [metadata, setMetadata] = useState<Metadata>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageSize] = useState<number>(6);
    const [areUsersLoaded, setAreUsersLoaded] = useState<boolean>(false);
    const [selectedFormat, setSelectedFormat] = useState('JSON'); // Default selection

    const reloadUsers = () => {
        setAreUsersLoaded(false);
    };

    const handleFormatChange = (event : any) => {
        setSelectedFormat(event.target.value);
    };

    const handleHostReviewsClick = async() =>{
        try {
            const response = (selectedFormat === 'XML') ? await agent.Catalog.getHostReviewsXML() : await agent.Catalog.getHostReviewsJSON();
            const blob = (selectedFormat === 'XML') ? new Blob([response.data], { type: 'application/xml' }) : new Blob([response.data], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            if(response.status === 204)
                return toast.error("There are no Host reviews to download!");
            console.log(response);
            const a = document.createElement('a');
            a.href = url;
            a.download = (selectedFormat === 'XML') ? 'HostReviews.xml' : 'HostReviews.json'; // Set the filename
            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading XML file:', error);
        }
    }



    const handleResidenceReviewsClick = async() =>{
        try {

            const response = (selectedFormat === 'XML') ? await agent.Catalog.getResidenceReviewsXML() : await agent.Catalog.getResidenceReviewsJSON();
            const blob = (selectedFormat === 'XML') ? new Blob([response.data], { type: 'application/xml' }) : new Blob([response.data], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            if(response.status === 204)
                return toast.error("There are no Residence Reviews to download!");
            console.log(response);
            const a = document.createElement('a');
            a.href = url;
            a.download = (selectedFormat === 'XML') ? 'ResidenceReviews.xml' : 'ResidenceReviews.json'; // Set the filename
            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading XML file:', error);
        }
    }


    const handleReservationsClick = async() =>{
        try {
            const response = (selectedFormat === 'XML') ? await agent.Catalog.getReservationsXML() : await agent.Catalog.getReservationsJSON();
            const blob = (selectedFormat === 'XML') ? new Blob([response.data], { type: 'application/xml' }) : new Blob([response.data], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            if(response.status === 204)
                return toast.error("There are no reservations to download!");
            console.log(response);
            const a = document.createElement('a');
            a.href = url;
            a.download = (selectedFormat === 'XML') ? 'Reservations.xml' : 'Reservations.json'; // Set the filename
            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading XML file:', error);
        }
    }


    const handleResidencesClick = async() =>{
        try {

            const response = (selectedFormat === 'XML') ? await agent.Catalog.getResidencesXML() : await agent.Catalog.getResidencesJSON();
            const blob = (selectedFormat === 'XML') ? new Blob([response.data], { type: 'application/xml' }) : new Blob([response.data], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            if(response.status === 204)
                return toast.error("There are no residences to download!");
            console.log(response);
            const a = document.createElement('a');
            a.href = url;
            a.download = (selectedFormat === 'XML') ? 'Residences.xml' : 'Residences.json'; // Set the filename
            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading XML file:', error);
        }
    }

    useEffect(() => {
        setAreUsersLoaded(false);
    }, [pageNumber]);

    useEffect(()=>{
        if(!areUsersLoaded) {
            const fetchUsers = async () => {
                const params = new URLSearchParams();
                params.append('pageNumber', pageNumber.toString());
                params.append('pageSize', pageSize.toString());
                try {
                    const response = await agent.Admin.getUsers(params);
                    setUsers(response.items);
                    setMetadata(response.metadata);
                    setAreUsersLoaded(true);
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            }
            fetchUsers();
        }
    }, [areUsersLoaded, pageNumber, pageSize]);

    if(!areUsersLoaded || !metadata)return <LoadingComponent message='Loading Users...'/>

    return(
        <div>
            <div style={{ marginBottom: '16px' }}>
                <Paper elevation={3} style={{ padding: '16px'}}> {/* Paper component */}
                    <Typography variant="h5" gutterBottom>
                        Export Data
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <Grid container spacing={4}>
                                <Grid item xs={2}>
                                    <Select
                                        value={selectedFormat}
                                        onChange={handleFormatChange}
                                        fullWidth
                                    >
                                        <MenuItem value="JSON">JSON</MenuItem>
                                        <MenuItem value="XML">XML</MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item xs={2.5}>
                                    <Button variant="contained" color="primary" onClick={handleResidencesClick}fullWidth>
                                        Residences
                                    </Button>
                                </Grid>
                                <Grid item xs={2.5}>
                                    <Button variant="contained" color="primary" onClick={handleReservationsClick} fullWidth>
                                        Reservations
                                    </Button>
                                </Grid>
                                <Grid item xs={3}>
                                    <Button variant="contained" color="primary" onClick={handleResidenceReviewsClick} fullWidth>
                                        Residence Reviews
                                    </Button>
                                </Grid>
                                <Grid item xs={2}>
                                    <Button variant="contained" color="primary" onClick={handleHostReviewsClick} fullWidth>
                                        Host Reviews
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
            <div>
                <div style={{ marginBottom: '16px' }}>
                    <Grid item xs={12}>
                        {users.length > 0 ? (
                            <Grid container spacing={4}>
                                {users.map(user =>(
                                    <Grid item xs={4} key={user.id}>
                                        <UserCard key={user.id} user={user} onReloadUsers={reloadUsers}/>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <h2>Loading Users...</h2>
                        )}
                    </Grid>
                </div>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center">
                        <AppPagination metadata={metadata} onPageChange={(page : number) => setPageNumber(page)}/>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}