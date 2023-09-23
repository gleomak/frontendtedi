import {Residence} from "../../app/models/residence";
import {Button, Card, CardActions, CardContent, CardMedia, IconButton} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Typography from "@mui/material/Typography";
import {Link, useNavigate} from "react-router-dom";
import ForumIcon from '@mui/icons-material/Forum';
import React from "react";
import {useAppDispatch} from "../../store/configureStore";
import {setMessageParams} from "./accountSlice";
import agent from "../../app/api/agent";
import {removeResidence} from "../catalog/catalogSlice";

interface Prop{
    residence : Residence;
    reloadResidences: () => void;
}
export default function MyResidenceCard({residence, reloadResidences}:Prop){
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const HandleOnClickMessages = () =>{
        dispatch(setMessageParams({searchResidenceName : residence.title}))
        navigate('/messages')
    }

    const  HandleOnClickDelete = async() =>{
        await agent.Catalog.deleteResidence(residence.id).then(() => dispatch(removeResidence(residence.id)));
        // navigate('/myResidences')
        reloadResidences();
    }

    return (
        <Card style={{ border: "none", boxShadow: "none" }}>
            <CardMedia
                sx={{ height: 140 }}
                image={residence.imageURL[0]}
            />
            <CardContent>
                <>
                    <Typography gutterBottom variant="h5" component="div">
                        {residence.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Address:</strong> {residence.address}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <strong>City:</strong> {residence.city}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        <strong>Neighborhood:</strong> {residence.neighborhood}
                    </Typography>
                </>
            </CardContent>
            <CardActions>
                <Button component={Link} to={`/myResidenceEdit/${residence.id}`} size="small" variant="contained">Details/Edit</Button>
                <IconButton
                    aria-label="delete product"
                    color="error"
                    onClick={HandleOnClickDelete}
                >
                    <DeleteForeverIcon />
                </IconButton>
                <IconButton
                    onClick={HandleOnClickMessages}
                >
                    <ForumIcon/>
                </IconButton>
            </CardActions>
        </Card>
    );
}