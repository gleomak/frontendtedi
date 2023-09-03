import Typography from "@mui/material/Typography";
import { User } from "../../app/models/user";
import {useEffect, useState} from "react";

export default function ControlPanel(){
    const [users, setUsers] = useState<User[]>([]);

    return(
        <Typography variant = "h2">

        </Typography>
    )
}