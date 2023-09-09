import {Checkbox, FormControlLabel, Input, InputLabel, Paper} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import {Link, useNavigate} from "react-router-dom";
import Container from "@mui/material/Container";
import * as React from "react";
import {FieldValues, useForm} from "react-hook-form";
import {MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";
import {useCallback, useMemo, useRef, useState} from "react";
import L from 'leaflet'; // Import Leaflet library
import "./Map.css";
import "leaflet/dist/leaflet.css"
import { LatLngExpression } from 'leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import {Icon} from 'leaflet';
import {useAppSelector} from "../../store/configureStore";
import {residencesSelectors} from "./catalogSlice";
import agent from "../../app/api/agent";


L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
    iconUrl: require('leaflet/dist/images/marker-icon.png').default,
    shadowUrl: require('leaflet/dist/images/marker-shadow.png').default
});


export default function CreateResidence() {

    const navigate = useNavigate();
    const{register, handleSubmit, setError,
        formState:{isSubmitting, errors, isValid}} = useForm({
        mode: 'onTouched'
    });



    const {user} = useAppSelector((state) => state.account);

    const center: LatLngExpression = [37.9838, 23.7275];
    const [draggable, setDraggable] = useState(false);
    const [position, setPosition] = useState(center);
    const markerRef = useRef(null);

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current as any; // Use type assertion
                if (marker != null) {
                    const latlng = marker._latlng; // Access _latlng property
                    setPosition([latlng.lat, latlng.lng]);
                }
            },
        }),
        []
    );

    const toggleDraggable = useCallback(() => {
        setDraggable((d) => !d);
    }, []);


    async function handleResidenceSubmit(data: FieldValues){
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('neighborhood', data.neighborhood);
        formData.append('city', data.city);
        formData.append('country', data.country);
        formData.append('address', data.address);
        formData.append('residenceCapacity', data.residenceCapacity);
        formData.append('numOfBeds', data.numOfBeds);
        formData.append('numOfBathrooms', data.numOfBathrooms);
        formData.append('residenceType', data.residenceType);
        formData.append('costPerNight', data.costPerNight);
        formData.append('livingRoom', data.livingRoom);
        formData.append('squareMeters', data.squareMeters);
        formData.append('description', data.description);
        formData.append('smoking', data.smoking);
        formData.append('pets', data.pets);
        formData.append('events', data.events);
        formData.append('internet', data.internet);
        formData.append('aircondition', data.aircondition);
        formData.append('kitchen', data.kitchen);
        formData.append('parkingSpot', data.parkingSpot);
        formData.append('tv', data.tv);
        formData.append('minDaysForReservation', data.minDaysForReservation);
        formData.append('latitude', position[0].toString());
        formData.append('longitute', position[1].toString());
        const namesAdd = Array.from(imagesToAdd).map((file) => file.name);
        imagesToAdd.forEach((filename) =>{
            formData.append('files', filename);
        })
        formData.append('userId', user?.id!);
        await agent.Catalog.createResidence(formData);
    }

    const [imagesToAdd, setImagesToAdd] = useState<File[]>([]);

    const handleFileChange = (e : any) => {
        const files : File[] = Array.from(e.target.files);
        setImagesToAdd((prevSelectedFiles) => [...prevSelectedFiles, ...files]);
    };

    return(
        <Container component={Paper} maxWidth="lg" sx={{display : 'flex', flexDirection: 'column', alignItems: 'center',justifyItems:"center", p:4}}>
            <Typography component="h1" variant="h3"  sx={{ fontWeight: 'bold' }}>
                Create a Residence
            </Typography>
            <Box component="form"
                 onSubmit={handleSubmit(handleResidenceSubmit)}
                 noValidate sx={{ mt: 1 }}>

                <Grid container spacing={2}  justifyContent="center">

                    <Grid item xs={12} sm={4} md={6}>
                        {/* Residence Title */}
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Residence Title"
                            {...register('title', { required: 'Title is required!' })}
                            error={!!errors.title}
                            helperText={errors?.title?.message as string}
                        />

                        {/* Neighborhood */}
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Neighborhood"
                            {...register('neighborhood', { required: 'Neighborhood is required!' })}
                            error={!!errors.neighborhood}
                            helperText={errors?.neighborhood?.message as string}
                        />

                        {/* City */}
                        <TextField
                            margin="normal"
                            fullWidth
                            label="City"
                            {...register('city', { required: 'City is required!' })}
                            error={!!errors.city}
                            helperText={errors?.city?.message as string}
                        />

                        {/* Country */}
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Country"
                            {...register('country', { required: 'Country is required!' })}
                            error={!!errors.country}
                            helperText={errors?.country?.message as string}
                        />

                        <TextField
                            margin="normal"
                            fullWidth
                            label="Address"
                            {...register('address', { required: 'Address is required!' })}
                            error={!!errors.address}
                            helperText={errors?.address?.message as string}
                        />

                        <Typography component="h1" variant="h6">
                            Place the marker on your residence's location:
                        </Typography>

                        {/* Integrate the MapContainer */}
                        <MapContainer
                            center={center}
                            zoom={10} // You can adjust the initial zoom level
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                            />
                            <Marker
                                icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}
                                draggable={draggable}
                                position={position}
                                ref={markerRef}
                                eventHandlers={eventHandlers}
                            >
                                <Popup minWidth={90}>
                                        <span onClick={toggleDraggable}>
                                          {draggable
                                              ? 'Marker is draggable'
                                              : 'Click here to make marker draggable'}
                                        </span>
                                </Popup>
                            </Marker>
                        </MapContainer>

                    </Grid>

                    <Grid item xs={12} sm={4} md={3}>
                        {/* Residence Capacity */}
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Residence Capacity"
                            {...register('residenceCapacity', { required: 'Capacity is required!' })}
                            error={!!errors.residenceCapacity}
                            helperText={errors?.residenceCapacity?.message as string}
                        />

                        {/* Number of Beds */}
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Number of Beds"
                            type="number"
                            {...register('numOfBeds', { required: 'Number of Beds is required!' })}
                            error={!!errors.numOfBeds}
                            helperText={errors?.numOfBeds?.message as string}
                        />

                        {/* Number of Bathrooms */}
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Number of Bathrooms"
                            type="number"
                            {...register('numOfBathrooms', { required: 'Number of Bathrooms is required!' })}
                            error={!!errors.numOfBathrooms}
                            helperText={errors?.numOfBathrooms?.message as string}
                        />

                        {/* Residence Type */}
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Residence Type"
                            {...register('residenceType', { required: 'Residence Type is required!' })}
                            error={!!errors.residenceType}
                            helperText={errors?.residenceType?.message as string}
                        />

                        {/* Number of Bedrooms */}
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Number of Bedrooms"
                            type="number"
                            {...register('numOfBedrooms', { required: 'Number of Bedrooms is required!' })}
                            error={!!errors.numOfBedrooms}
                            helperText={errors?.numOfBedrooms?.message as string}
                        />

                        {/* Price Per Night */}
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Cost per Night"
                            type="number"
                            {...register('costPerNight', { required: 'Cost Per Night is required!' })}
                            error={!!errors.costPerNight}
                            helperText={errors?.costPerNight?.message as string}
                        />

                        {/* Square Meters */}
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Square Meters"
                            type="number"
                            {...register('squareMeters', { required: 'Square Meters is required!' })}
                            error={!!errors.squareMeters}
                            helperText={errors?.squareMeters?.message as string}
                        />

                        {/* Description */}
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Description"
                            multiline
                            rows={4}
                            {...register('description', { required: 'Description is required!' })}
                            error={!!errors.description}
                            helperText={errors?.description?.message as string}
                        />

                        {/* Minimum Days for Reservation */}
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Minimum Days for Reservation"
                            type="number"
                            {...register('minDaysForReservation', { required: 'Minimum Days for Reservation is required!' })}
                            error={!!errors.minDaysForReservation}
                            helperText={errors?.minDaysForReservation?.message as string}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4} md={3}>
                        {/* Living Room */}
                        <div style={{ display: "block" }}>
                            <FormControlLabel
                                control={<Checkbox {...register('livingRoom')} />}
                                label="Living Room"
                            />
                        </div>

                        {/* Smoking */}
                        <div style={{ display: "block" }}>
                            <FormControlLabel
                                control={<Checkbox {...register('smoking')} />}
                                label="Smoking Allowed"
                            />
                        </div>

                        {/* Pets */}
                        <div style={{ display: "block" }}>
                            <FormControlLabel
                                control={<Checkbox {...register('pets')} />}
                                label="Pets Allowed"
                            />
                        </div>

                        {/* Events */}
                        <div style={{ display: "block" }}>
                            <FormControlLabel
                                control={<Checkbox {...register('events')} />}
                                label="Events Allowed"
                            />
                        </div>

                        {/* Internet */}
                        <div style={{ display: "block" }}>
                            <FormControlLabel
                                control={<Checkbox {...register('internet')} />}
                                label="Internet"
                            />
                        </div>

                        {/* Air Conditioning */}
                        <div style={{ display: "block" }}>
                            <FormControlLabel
                                control={<Checkbox {...register('aircondition')} />}
                                label="Air Conditioning"
                            />
                        </div>

                        {/* Kitchen */}
                        <div style={{ display: "block" }}>
                            <FormControlLabel
                                control={<Checkbox {...register('kitchen')} />}
                                label="Kitchen"
                            />
                        </div>

                        {/* Parking Spot */}
                        <div style={{ display: "block" }}>
                            <FormControlLabel
                                control={<Checkbox {...register('parkingSpot')} />}
                                label="Parking Spot"
                            />
                        </div>

                        {/* TV */}
                        <div style={{ display: "block" }}>
                            <FormControlLabel
                                control={<Checkbox {...register('tv')} />}
                                label="TV"
                            />
                        </div>

                        <InputLabel htmlFor="first-name-input">Upload Pictures for Your Residence!</InputLabel>
                        <input
                            {...register("files")}
                            type="file"
                            multiple
                            onChange={handleFileChange}
                        />
                    </Grid>

                </Grid>

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 3, mb: 2}}

                >
                    Submit Residence
                </Button>
            </Box>
        </Container>
    );
}