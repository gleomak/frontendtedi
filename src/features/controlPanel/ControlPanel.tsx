import Typography from "@mui/material/Typography";
import { User } from "../../app/models/user";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import agent from "../../app/api/agent";
import {Metadata} from "../../app/models/metadata";
import {Grid} from "@mui/material";
import ResidenceCard from "../catalog/ResidenceCard";
import UserCard from "./UserCard";

export default function ControlPanel(){
    const [users, setUsers] = useState<User[]>([]);
    const [metadata, setMetadata] = useState<Metadata>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [areUsersLoaded, setAreUsersLoaded] = useState<boolean>(false);
    const dispatch = useDispatch();

    const reloadUsers = () => {
        setAreUsersLoaded(false);
    };

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
    }, [areUsersLoaded]);

    return(
        <div>
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
        </div>
    )
}