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
import "./Map.css";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import L, {Icon, LatLngExpression} from "leaflet";
import * as React from "react";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import {Host} from "../../app/models/user";
import agent from "../../app/api/agent";


export default function ResidenceDetails() {
    const dispatch = useAppDispatch();
    const {id} = useParams<{ id: string }>();
    const residence = useAppSelector(state => residencesSelectors.selectById(state, id!));
    const {status: residenceStatus} = useAppSelector(state => state.catalog);
    const [isLoading, setIsLoading] = useState(true);
    const [host, setHost] = useState<Host>();
    const [position, setPosition] = useState<LatLngExpression | undefined>(undefined);
    const [booleanHost, setHostBoolean] = useState<boolean>(false);

    useEffect(() => {
        if (!residence) {
            dispatch(fResidenceAsync(parseInt(id!))).then(() => setIsLoading(false));
        }

        if(residence){
            setPosition([Number(residence?.latitude), Number(residence?.longitude)]);
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
                        src={`${residence.imageURL[selectedImageIndex]}?w=800&h=800&fit=crop&auto=format`}
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