import Typography from "@mui/material/Typography";
import {NavLink, useParams} from "react-router-dom";
import {SetStateAction, useEffect, useState} from "react";
import {Grid, Button, ImageListItem, ImageList, IconButton, Rating} from "@mui/material";
import {Modal} from "@mui/material";
import { ArrowBackIos as ArrowBackIosIcon, ArrowForwardIos as ArrowForwardIosIcon} from "@mui/icons-material";
import MessageIcon from '@mui/icons-material/Message';
import {useAppDispatch, useAppSelector} from "../../store/configureStore";
import {fResidenceAsync, residencesSelectors} from "./catalogSlice";
import "./ResidenceDetails.css";


export default function ResidenceDetails() {
    const dispatch = useAppDispatch();
    const {id} = useParams<{ id: string }>();
    const residence = useAppSelector(state => residencesSelectors.selectById(state, id!));
    const {status: residenceStatus} = useAppSelector(state => state.catalog);
    useEffect(() => {
        if (!residence) dispatch(fResidenceAsync(parseInt(id!)));
    }, [id, dispatch, residence])

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index);
        setModalOpen(true);
    };

    const handlePreviousImage = () => {
        setSelectedImageIndex(prevIndex => (prevIndex - 1 + itemData.length) % itemData.length);
    };

    const handleNextImage = () => {
        setSelectedImageIndex(prevIndex => (prevIndex + 1) % itemData.length);
    };

    if(residenceStatus.includes('pending')) return <h3>Loading...</h3>
    if(!residence) return <h3>Product not found</h3>

    return(
        <div className={"mainDiv"}>
            <Grid container spacing={2}>
                <Grid item xs={6} md={8}>
                    <ImageList sx={{ width: 600, height: 550 }} cols={3} rowHeight={164}>
                        {itemData.map((item, index) => (
                            <ImageListItem key={item.img} onClick={() => handleImageClick(index)}>
                                <img
                                    src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                                    srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                    alt={item.title}
                                    loading="lazy"
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Grid>
                <Grid item xs={6} md={4}>
                    <p className={"title"}> {residence.title }</p>
                    <p className={"address"}> {residence.neighborhood}, {residence.city} , {residence.country} </p>
                    <div className={"spaceDetails-div"}>
                        <u className={"subDetailsTitle"}>Details</u>
                        <p className={"subDetailsContent"}>
                            • Number of beds: <span className={"detail"}>{residence.numOfBeds}</span> <br/>
                            • Number of bathrooms: <span className={"detail"}>{residence.numOfBathrooms}</span> <br/>
                            • Type of rental space: <span className={"detail"}>{residence.residenceType}</span> <br/>
                            • Number of bedrooms: <span className={"detail"}>{residence.numOfBedrooms}</span> <br/>
                            • Living room: <span className={"detail"}> {residence.livingRoom ? <span>&#10004;</span> : <span>&#10006;</span>} </span> <br/>
                            • Area: <span className={"detail"}>{residence.squareMeters} m<sup>2</sup> </span>
                        </p>
                    </div>
                    <div className={"spaceDetails-div"}>
                        <u className={"subDetailsTitle"}>Rental Rules</u>
                        <p className={"subDetailsContent"}>
                            • Smoking allowed: <span className={"detail"}> {residence.smoking ? <span>&#10004;</span> : <span>&#10006;</span>} </span> <br/>
                            • Pets allowed: <span className={"detail"}> {residence.pets ? <span>&#10004;</span> : <span>&#10006;</span>} </span> <br/>
                            • Events allowed: <span className={"detail"}> {residence.events ? <span>&#10004;</span> : <span>&#10006;</span>} </span> <br/>
                            • Minimum days for reservation: <span className={"detail"}>{residence.minDaysForReservation} days</span> <br/>
                        </p>
                    </div>
                    <div className={"spaceDetails-div"}>
                        <u className={"subDetailsTitle"}>Rental Description</u>
                        <p className={"descriptionText"}> {residence.description} </p>
                    </div>
                    <div className={"spaceDetails-div"}>
                        <u className={"subDetailsTitle"}>Landlord</u>
                        <div className={"landlordDetails"}>
                            <Grid container spacing={4}>
                                <Grid item xs>
                                    <div className={"landlordImageContainer"}>
                                        <img
                                            src='https://images.unsplash.com/photo-1551963831-b3b1ca40c98e'
                                            alt='Breakfast'
                                            loading="lazy"
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={6} md={4}>
                                    <div className={"grid2"}>
                                        <a className={"landlordName"}>Nikos Papadopoulos</a>
                                        <Rating name="no-value" value={null} readOnly/>
                                    </div>
                                </Grid>
                                <Grid item xs>
                                    <Button variant="contained" disableElevation>
                                        <MessageIcon/>
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </Grid>
            </Grid>

            <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                <NavLink to={`/catalog/reservation/${id}`}>
                    <Button variant="contained" disableElevation>
                        Create a Reservation
                    </Button>
                </NavLink>

            </div>

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            >
                <div className={"modal-content"}>
                    <IconButton className="arrow left" onClick={handlePreviousImage}>
                        <ArrowBackIosIcon />
                    </IconButton>
                    <img
                        src={`${itemData[selectedImageIndex].img}?w=800&h=800&fit=crop&auto=format`}
                        alt={itemData[selectedImageIndex].title}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                    <IconButton className="arrow right" onClick={handleNextImage}>
                        <ArrowForwardIosIcon />
                    </IconButton>
                </div>
            </Modal>
        </div>

    )
}

const itemData = [
    {
        img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
        title: 'Breakfast',
    },
    {
        img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
        title: 'Burger',
    },
    {
        img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
        title: 'Camera',
    },
    {
        img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
        title: 'Coffee',
    },
    {
        img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
        title: 'Hats',
    },
    {
        img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
        title: 'Honey',
    },
    {
        img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
        title: 'Basketball',
    },
    {
        img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
        title: 'Fern',
    },
    {
        img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
        title: 'Mushrooms',
    },
    {
        img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
        title: 'Tomato basil',
    },
    {
        img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
        title: 'Sea star',
    },
    {
        img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
        title: 'Bike',
    },
];