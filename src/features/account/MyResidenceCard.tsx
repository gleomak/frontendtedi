import {Residence} from "../../app/models/residence";
import {Button, Card, CardActions, CardContent, CardMedia, IconButton} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Typography from "@mui/material/Typography";
import {Link} from "react-router-dom";
import React from "react";

interface Prop{
    residence : Residence;
}
export default function MyResidenceCard({residence}:Prop){
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
                <Button component={Link} to={`/catalog/${residence.id}`} size="small" variant="contained">Details/Edit</Button>
                <IconButton
                    aria-label="delete product"
                    color="error"
                >
                    <DeleteForeverIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
}