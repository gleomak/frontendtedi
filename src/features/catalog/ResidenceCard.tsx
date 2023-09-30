import {Button, Card, CardActions, CardContent, CardMedia, Grid, Rating} from "@mui/material";
import Typography from "@mui/material/Typography";
import {ReservationFromTo, Residence, ResidenceReview} from "../../app/models/residence";
import {Link} from "react-router-dom";
import * as React from "react";

interface Prop{
    residence : Residence;
}

const getResReviewRatingAverage = (reviews: ResidenceReview[]): number =>{
    if(reviews.length ===0){
        return 0;
    }
    let totalStarRating = 0;
    reviews.forEach((review)=>{
        totalStarRating+=(+review.starRating);
    });
    const averageStarRating = totalStarRating / reviews.length;
    return averageStarRating;
}
export default function ResidenceCard({residence}:Prop){
    return (
        <Card style={{ border: "none", boxShadow: "none" }}>
            <CardMedia
                sx={{ height: 140 }}
                image={residence.imageURL[0]}
                title="green iguana"
            />
            <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                {residence.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {residence.residenceType}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Cost/Night: {residence.costPerNight}€
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Number of Beds: {residence.numOfBeds}
                </Typography>
                <Grid container spacing={1} sx={{paddingTop:'10px'}}>
                    <Grid>
                        <Rating name="no-value" value={getResReviewRatingAverage(residence.reviewss)} readOnly />
                    </Grid>
                    <Grid>
                        <a> ( {residence.reviewss.length} )</a>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <Button component={Link} to={`/catalog/${residence.id}`} size="small">Learn More</Button>
            </CardActions>
        </Card>
    );
}