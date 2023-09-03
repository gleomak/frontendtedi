import Typography from "@mui/material/Typography";
import { User } from "../../app/models/user";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";

export default function ControlPanel(){
    const [users, setUsers] = useState<User[]>([]);
    const [areUsersLoaded, setAreUsersLoaded] = useState<boolean>(false);
    const dispatch = useDispatch();

    useEffect(()=>{
        if(!areUsersLoaded){

        }
    })

    return(
        <Typography variant = "h2">

        </Typography>
    )
}