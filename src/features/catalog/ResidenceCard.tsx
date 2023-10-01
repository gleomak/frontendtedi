import {Button, Card, CardActions, CardContent, CardMedia, Grid, Rating} from "@mui/material";
import Typography from "@mui/material/Typography";
import {ReservationFromTo, Residence, ResidenceReview} from "../../app/models/residence";
import {Link, useNavigate} from "react-router-dom";
import * as React from "react";
import agent from "../../app/api/agent";
import {useAppSelector} from "../../store/configureStore";

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
    const user = useAppSelector(state => state.account.user);
    const navigate = useNavigate();
    const handleLearnMoreClick = async()=>{
        if(user) {
            const formData = new FormData();
            formData.append('userId',user.id);
            formData.append('residenceId', residence.id.toString());
            await agent.Catalog.postViewedResidence(formData);
        }
        navigate(`/catalog/${residence.id}`);
    }

    return (
        <Card style={{ border: "none", boxShadow: "none" }}>
            <CardMedia
                sx={{ height: 140 }}
                image={residence.imageURL[0]}
                title="residence image"
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
                        ( {residence.reviewss.length} )
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <Button  color="primary" onClick={handleLearnMoreClick} size="small">Learn More</Button>
            </CardActions>
        </Card>
    );
}