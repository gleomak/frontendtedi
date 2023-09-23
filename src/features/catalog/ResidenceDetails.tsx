import Typography from "@mui/material/Typography";
import {NavLink, useParams} from "react-router-dom";
import {SetStateAction, useEffect, useState} from "react";
import {
    Grid,
    Button,
    ImageListItem,
    ImageList,
    IconButton,
    Rating,
    Dialog,
    DialogContent,
    Box,
    Divider, TextField
} from "@mui/material";
import {Modal} from "@mui/material";
import { ArrowBackIos as ArrowBackIosIcon, ArrowForwardIos as ArrowForwardIosIcon} from "@mui/icons-material";
import MessageIcon from '@mui/icons-material/Message';
import {useAppDispatch, useAppSelector} from "../../store/configureStore";
import {fResidenceAsync, residencesSelectors} from "./catalogSlice";
import "./ResidenceDetails.css";
import "./Map.css";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import L, {Icon, LatLngExpression} from "leaflet";
import * as React from "react";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import {Host} from "../../app/models/user";
import agent from "../../app/api/agent";
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import Avatar from "@mui/material/Avatar";
import {toast} from "react-toastify";


export default function ResidenceDetails() {
    const dispatch = useAppDispatch();
    const {id} = useParams<{ id: string }>();
    const residence = useAppSelector(state => residencesSelectors.selectById(state, id!));
    const {status: residenceStatus} = useAppSelector(state => state.catalog);
    const [isLoading, setIsLoading] = useState(true);
    const [host, setHost] = useState<Host>();
    const [position, setPosition] = useState<LatLngExpression | undefined>(undefined);
    const [booleanHost, setHostBoolean] = useState<boolean>(false);
    const [open, setOpen] = useState(false); // State to control the dialog
    const [reviewsOpen, setReviewsOpen] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [reviewDescriptionText, setReviewDescriptionText] = useState('');
    const [reviewDescriptionRating, setReviewDescriptionRating] = useState(0);
    const [createReviewsOpen, setCreateReviewsOpen] = useState(false);
    const user = useAppSelector(state => state.account.user);

    useEffect(() => {
        if (!residence && id) {
            dispatch(fResidenceAsync(parseInt(id!))).then(() => setIsLoading(false));
        }

        if(residence){
            setPosition([Number(residence.latitude), Number(residence.longitude)]);
            const fetchHost = async () => {
                const params = new URLSearchParams();
                params.append("residenceId", residence.id.toString());
                try {
                    const response = await agent.Catalog.getHostInfo(params);
                    setHost(response);
                    setHostBoolean(true);

                } catch (error) {
                    console.error('Error fetching host:', error);
                }
            }
            fetchHost();
        }
    }, [id, dispatch, residence])

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index);
        setModalOpen(true);
    };

    if((isLoading && !residence) || !booleanHost) return <h3>Loading..</h3>
    if(residenceStatus.includes('pending')) return <h3>Loading...</h3>

    if(!residence) return <h3>Product not found</h3>

    const handlePreviousImage = () => {
        setSelectedImageIndex(prevIndex => (prevIndex - 1 + residence?.imageURL.length!) % residence?.imageURL.length!);
    };

    const handleNextImage = () => {
        setSelectedImageIndex(prevIndex => (prevIndex + 1) % residence?.imageURL.length!);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleReviewsClick = () =>{
        setReviewsOpen(true);
    };

    const handleCreateRevClick =() =>{
        setCreateReviewsOpen(true);
    }

    const handleCreateReviewClose = () => {
        setCreateReviewsOpen(false);
    }

    const handleSend = () => {
        if (replyText.trim() === '') {
            // Show a toast notification if replyText is empty
            toast.error('Please enter a reply message.');
            return; // Do not proceed with empty reply
        }
        const formData = new FormData();
        formData.append('messageBody', replyText);
        formData.append('recipientUsername', host?.username!);
        formData.append('residenceTitle', residence.title);
        agent.Account.postUserMessage(formData).then(() => {
            toast.success("Message sent!")})
            .catch(errors => console.log(errors));
        handleClose(); // Close the dialog after replying
    };

    const handleSendReview = () => {
        if (reviewDescriptionText.trim() === '') {
            // Show a toast notification if replyText is empty
            toast.error('Please enter a reply message.');
            return; // Do not proceed with empty reply
        }
        const formData = new FormData();
        formData.append('description', reviewDescriptionText);
        formData.append('starRating', reviewDescriptionRating.toString());
        formData.append('hostName', host?.username!);
        formData.append('reviewByUser', user?.username!);
        agent.Account.postUserMessage(formData).then(() => {
            toast.success("Review sent!")})
            .catch(errors => console.log(errors));
        handleCreateReviewClose(); // Close the dialog after replying
    }


    return(
        <div className={"mainDiv"}>
            <p className={"title"}> {residence.title }</p>
            <Grid container spacing={2}>
                <Grid item xs={6} md={8}>
                    <ImageList sx={{ width: 600, height: 550 }} cols={3} rowHeight={164}>
                        {residence.imageURL.map((imageURL, index) => (
                            <ImageListItem key={index} onClick={() => handleImageClick(index)}>
                                <img
                                    src={`${imageURL}?w=164&h=164&fit=crop&auto=format`}
                                    srcSet={`${imageURL}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                    loading="lazy"
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>

                    <MapContainer
                        center={position}
                        zoom={8} // You can adjust the initial zoom level
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                        />
                        <Marker
                            icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}
                            position={position!}
                        >
                        </Marker>
                    </MapContainer>

                </Grid>
                <Grid item xs={6} md={4}>
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
                        <u className={"subDetailsTitle"}>Residence Reviews</u>
                        <div className={"landlordDetails"}>
                            <Grid container spacing={1}>
                                <Rating name="no-value" value={null} readOnly/>
                            </Grid>
                        </div>
                    </div>
                    <div className={"spaceDetails-div"}>
                        <u className={"subDetailsTitle"}>{host!.username}</u>
                        <div className={"landlordDetails"}>
                            <Grid container spacing={2} sx={{padding: '5px'}}>
                                <Grid item xs>
                                    <Avatar alt={host?.username} src={host?.imageURL} />
                                </Grid>
                                <Grid item>
                                    <div onClick={handleReviewsClick}>
                                        <Rating name="no-value" value={host?.rating} readOnly />
                                    </div>
                                </Grid>
                                <Grid item xs>
                                    <Button variant="contained" disableElevation  sx={{marginBottom: '3px'}} onClick={handleClickOpen}>
                                        <MessageIcon/>
                                    </Button>
                                    <Button variant="contained" disableElevation  sx={{marginTop: '3px'}} onClick={handleCreateRevClick}>
                                        <ThumbsUpDownIcon/>
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
                        src={`${residence.imageURL[selectedImageIndex]}?w=800&h=800&fit=crop&auto=format`}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                    <IconButton className="arrow right" onClick={handleNextImage}>
                        <ArrowForwardIosIcon />
                    </IconButton>
                </div>
            </Modal>


            <Dialog
                open={reviewsOpen}
                onClose={() => setReviewsOpen(false)}
                maxWidth={"lg"}
                fullWidth
            >
                <DialogContent>
                    <div style={{ textAlign: 'center', paddingBottom: '20px' }}>
                        <Typography variant="h3">Reviews For Host: {host?.username}</Typography>
                    </div>
                    <Divider sx={{ marginY: 2 }} />
                    {host?.hostReviews.map((item, index) =>(
                        <div key={index} className={"reviewDiv"}>
                            <Typography variant="h6"> From {item.reviewByUser} :</Typography>

                            <Rating value={item.starRating} readOnly />
                            <TextField
                                inputProps={
                                    { readOnly: true, }
                                }
                                fullWidth
                                multiline
                                label="Review Description"
                                value={item.description}
                            />
                            <Divider sx={{ marginY: 2 }} />
                        </div>
                        ))}
                </DialogContent>
            </Dialog>

            <Dialog open={createReviewsOpen} onClose={() => setCreateReviewsOpen(false)} maxWidth="md" fullWidth>
                <DialogContent>
                    <Typography component="legend">Review Rating</Typography>
                    <Rating
                        name="simple-controlled"
                        value={reviewDescriptionRating}
                        onChange={(event, newValue) => {
                            setReviewDescriptionRating(newValue!);
                        }}
                    />

                    <Divider sx={{ marginY: 2 }} />

                    <TextField
                        fullWidth
                        variant="outlined"
                        multiline
                        label="ReviewDescription"
                        value={reviewDescriptionText}
                        onChange={(e) => setReviewDescriptionText(e.target.value)}
                    />

                    <Divider sx={{ marginY: 2 }} />

                    <Button variant="contained" color="primary" onClick={handleSendReview}>
                        Submit Review
                    </Button>
                </DialogContent>
            </Dialog>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogContent>
                    <Typography variant="h6"> From {user?.username}, To {host?.username} | {residence.title} :</Typography>
                    <Divider sx={{ marginY: 2 }} />
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Your Message"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                    />
                    <Divider sx={{ marginY: 1 }} />
                    <Button variant="contained" color="primary" onClick={handleSend}>
                        Send Message
                    </Button>
                </DialogContent>
            </Dialog>
        </div>

    )
}