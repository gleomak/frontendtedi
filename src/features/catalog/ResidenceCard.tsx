import {Button, Card, CardActions, CardContent, CardMedia} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Residence} from "../../app/models/residence";
import {Link} from "react-router-dom";

interface Prop{
    residence : Residence;
}
export default function ResidenceCard({residence}:Prop){
    return (
        <Card style={{ border: "none", boxShadow: "none" }}>
            <CardMedia
                sx={{ height: 140 }}
                image="/static/images/cards/contemplative-reptile.jpg"
                title="green iguana"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {residence.residenceType}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {residence.city}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Share</Button>
                <Button component={Link} to={`/catalog/${residence.id}`} size="small">Learn More</Button>
            </CardActions>
        </Card>
    );
}