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


    const handleResidencesClick = async() =>{
        let response = (selectedFormat === 'JSON') ? await agent.Catalog.getResidencesXML() : await agent.Catalog.getResidencesJSON();
        let blob = (selectedFormat === 'JSON') ? new Blob([response.data], { type: 'application/json' }) : new Blob([response.data], { type: 'application/xml' });
        const url = window.URL.createObjectURL(blob);

        // Create a temporary <a> element to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = (selectedFormat === 'JSON') ? 'Residences.json' : 'Residences.xml'; // Set the filename
        document.body.appendChild(a);
        a.click();

        // Clean up the blob and URL
        window.URL.revokeObjectURL(url);
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
                                    <Button variant="contained" color="primary" fullWidth>
                                        Reservations
                                    </Button>
                                </Grid>
                                <Grid item xs={3}>
                                    <Button variant="contained" color="primary" fullWidth>
                                        Residence Reviews
                                    </Button>
                                </Grid>
                                <Grid item xs={2}>
                                    <Button variant="contained" color="primary" fullWidth>
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