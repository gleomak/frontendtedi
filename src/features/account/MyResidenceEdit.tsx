import {useAppDispatch, useAppSelector} from "../../store/configureStore";
import {useParams} from "react-router-dom";
import {fResidenceAsync, residencesSelectors} from "../catalog/catalogSlice";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import {Controller, FieldValues, useForm} from "react-hook-form";
import Button from "@mui/material/Button";
import {
    Card,
    CardContent,
    CardMedia,
    Checkbox,
    FormControlLabel,
    Grid,
    ImageList,
    ImageListItem, ImageListItemBar,
    Input,
    InputLabel
} from "@mui/material";
import TextField from "@mui/material/TextField";
import * as React from "react";
import agent from "../../app/api/agent";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import L, {Icon} from "leaflet";
import { LatLngExpression } from 'leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png";

export default function MyResidenceEdit(){
    const dispatch = useAppDispatch();
    const {id} = useParams<{ id: string }>();
    const residence = useAppSelector(state => residencesSelectors.selectById(state, id!));
    const {status: residenceStatus} = useAppSelector(state => state.catalog);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImages, setSelectedImages] = useState<{ [key: string]: boolean }>({});
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
    const [isMapLoading, setMapLoading] = useState<boolean>(true);
    const [imagesToAdd, setImagesToAdd] = useState<File[]>([]);
    const center: LatLngExpression = [37.9838, 23.7275];
    const{register, handleSubmit, control, setError, setValue}
        = useForm();

    const [draggable, setDraggable] = useState(false);
    const markerRef = useRef(null);

    const [position, setPosition] = useState(center);

    useEffect(() => {
        if (!residence && id){

            dispatch(fResidenceAsync(parseInt(id!))).then(() => {setIsLoading(false);});
        }
        if(residence){
            setPosition([Number(residence.latitude), Number(residence.longitude)]);
            setMapLoading(false);
            // console.log(position);
            setValue('title', residence.title);
            setValue('neighborhood', residence.neighborhood);
            setValue('city',residence.city);
            setValue('country', residence.country);
            setValue('residentCapacity', residence.residentCapacity);
            setValue('numOfBeds', residence.numOfBeds);
            setValue('numOfBathrooms', residence.numOfBathrooms);
            setValue('residenceType', residence.residenceType);
            setValue('numOfBedrooms',residence.numOfBedrooms);
            setValue('costPerNight', residence.costPerNight);
            setValue( 'livingRoom', residence.livingRoom);
            setValue( 'squareMeters', residence.squareMeters);
            setValue( 'description', residence.description);
            setValue('smoking', residence.smoking);
            setValue( 'pets', residence.pets);
            setValue( 'events', residence.events);
            setValue( 'internet', residence.internet);
            setValue('aircondition', residence.aircondition);
            setValue( 'kitchen', residence.kitchen);
            setValue('parkingSpot', residence.parkingSpot);
            setValue( 'tv', residence.tv);
            setValue('minDaysForReservation', residence.minDaysForReservation);
            setValue( 'address', residence.address);
            setValue('latitude', residence.latitude);
            setValue('longitude', residence.longitude);
            setValue('imagesToDelete', residence.imageURL.map(() => false));
        }
    }, [id, dispatch, residence, setValue]);


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

    if((!residence && isLoading) || isMapLoading) return(<LoadingComponent/>)
    if(!residence) return(<h3>Residence not found :(</h3>)

    const handleCheckboxChange = (imageUrl : string) => {
        const updatedSelection = { ...selectedImages };

        if (updatedSelection[imageUrl]) {
            delete updatedSelection[imageUrl];
        } else {
            updatedSelection[imageUrl] = true;
        }

        setSelectedImages(updatedSelection);
    };

    const handleFileChange = (e : any) => {
        const files : File[] = Array.from(e.target.files);
        setImagesToAdd((prevSelectedFiles) => [...prevSelectedFiles, ...files]);
    };


    async function handleUpdateSubmit(data: FieldValues){
        const selectedImagesArray = Object.keys(selectedImages);
        setImagesToDelete(selectedImagesArray);
        const formData = new FormData();
        formData.append('id', residence?.id.toString()!);
        formData.append('title', data.title);
        formData.append('neighborhood', data.neighborhood);
        formData.append('city',data.city);
        formData.append('country', data.country);
        formData.append('residentCapacity', data.residentCapacity);
        formData.append('numOfBeds', data.numOfBeds);
        formData.append('numOfBathrooms', data.numOfBathrooms);
        formData.append('residenceType', data.residenceType);
        formData.append('numOfBedrooms',data.numOfBedrooms);
        formData.append('costPerNight', data.costPerNight);
        formData.append( 'livingRoom', data.livingRoom);
        formData.append( 'squareMeters', data.squareMeters);
        formData.append( 'description', data.description);
        formData.append('smoking', data.smoking);
        formData.append( 'pets', data.pets);
        formData.append( 'events', data.events);
        formData.append( 'internet', data.internet);
        formData.append('aircondition', data.aircondition);
        formData.append( 'kitchen', data.kitchen);
        formData.append('parkingSpot', data.parkingSpot);
        formData.append( 'tv', data.tv);
        formData.append('minDaysForReservation', data.minDaysForReservation);
        formData.append( 'address', data.address);

        const namesAdd = Array.from(imagesToAdd).map((file) => file.name);
        imagesToAdd.forEach((filename) =>{
            formData.append('filesToAdd', filename);
        });

        selectedImagesArray.forEach((fileName) =>{
            formData.append('imagesToDelete', fileName);
        });

        formData.append('latitude', position[0].toString());
        formData.append('longitude', position[1].toString());

        // console.log(selectedImagesArray);
        //console.log(imagesToAdd);
        // console.log(namesAdd);
        await agent.Catalog.updateHostResidence(formData);
    }

    return(
        <Card raised={true}>
            <form onSubmit={handleSubmit(handleUpdateSubmit)}>
                <CardContent>
                    <Grid container spacing={3} alignItems="flex-start">
                        <Grid item xs={4} md={5}>
                            <ImageList sx={{ width: 450, height: 500 }} cols={2}>
                                {residence.imageURL.map((imageURL, index) => (
                                    <ImageListItem key={index} sx={{ width:225, height:250}}>
                                        <img
                                            src={`${imageURL}?w=164&h=164&fit=crop&auto=format`}
                                            srcSet={`${imageURL}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                            loading="lazy"
                                        />
                                        <ImageListItemBar
                                            title={
                                                <label>
                                                    <Checkbox
                                                        checked={selectedImages[imageURL] || false}
                                                        onChange={() => handleCheckboxChange(imageURL)}
                                                    />
                                                    Delete
                                                </label>
                                            }
                                            position="below"
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>

                            <MapContainer
                                center={position}
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
                        <Grid item xs={4} md={3.5}>
                            <TextField
                                fullWidth
                                margin="normal"

                                label="Residence Title"
                                autoFocus
                                {...register('title', {required: 'Title is required!'})}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Neighborhood"
                                autoFocus
                                {...register('neighborhood', {required: 'Neighborhood is required!'})}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                autoFocus
                                label="City"
                                {...register('city', {required: 'City is required!'})}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                autoFocus
                                label="Country"
                                {...register('country', {required: 'Country is required!'})}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                autoFocus
                                multiline
                                label="Description"
                                {...register('description', {required: 'Description is required!'})}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                autoFocus
                                label="Resident Capacity"
                                {...register('residentCapacity', {required: 'Resident Capacity is required!'})}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                autoFocus
                                label="Number of Beds"
                                {...register('numOfBeds', {required: 'Number Of Beds is required!'})}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                autoFocus
                                label="Residence Type"
                                {...register('residenceType', {required: 'Residence Type is required!'})}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                autoFocus
                                label="Number of BedRooms"
                                {...register('numOfBedrooms', {required: 'Number Of Bedrooms is required!'})}
                            />
                        </Grid>
                        <Grid item xs={4} md={3.5}>
                            <TextField
                                fullWidth
                                margin="normal"
                                autoFocus
                                label="Street Address"
                                {...register('address', {required: 'Address is required!'})}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                autoFocus
                                label="Min Days for Reservation"
                                {...register('minDaysForReservation', {required: 'Min days for reservation is required!'})}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                autoFocus
                                label="Cost Per Night"
                                {...register('costPerNight', {required: 'Cost per Night is required!'})}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                autoFocus
                                label="Square Meters"
                                {...register('squareMeters', {required: 'Square Meters is required!'})}
                            />
                            <Controller
                                control={control}
                                name={"tv"}
                                defaultValue={residence.tv}
                                render={({ field: { onChange, value } }) => (
                                    <FormControlLabel
                                        label="Has Tv"
                                        control={
                                            <Checkbox checked={value} onChange={onChange} />
                                        }
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name={"smoking"}
                                defaultValue={residence.smoking}
                                render={({ field: { onChange, value } }) => (
                                    <FormControlLabel
                                        label="Smoking Allowed"
                                        control={
                                            <Checkbox checked={value} onChange={onChange} />
                                        }
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name={"parkingSpot"}
                                defaultValue={residence.parkingSpot}
                                render={({ field: { onChange, value } }) => (
                                    <FormControlLabel
                                        label="Parking Spot"
                                        control={
                                            <Checkbox checked={value} onChange={onChange} />
                                        }
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name={"aircondition"}
                                defaultValue={residence.aircondition}
                                render={({ field: { onChange, value } }) => (
                                    <FormControlLabel
                                        label="AirCondition"
                                        control={
                                            <Checkbox checked={value} onChange={onChange} />
                                        }
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name={"livingRoom"}
                                defaultValue={residence.livingRoom}
                                render={({ field: { onChange, value } }) => (
                                    <FormControlLabel
                                        label="Living Room"
                                        control={
                                            <Checkbox checked={value} onChange={onChange} />
                                        }
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name={"pets"}
                                defaultValue={residence.pets}
                                render={({ field: { onChange, value } }) => (
                                    <FormControlLabel
                                        label="Pets Allowed"
                                        control={
                                            <Checkbox checked={value} onChange={onChange} />
                                        }
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name={"kitchen"}
                                defaultValue={residence.kitchen}
                                render={({ field: { onChange, value } }) => (
                                    <FormControlLabel
                                        label="Kitchen"
                                        control={
                                            <Checkbox checked={value} onChange={onChange} />
                                        }
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name={"internet"}
                                defaultValue={residence.internet}
                                render={({ field: { onChange, value } }) => (
                                    <FormControlLabel
                                        label="Internet"
                                        control={
                                            <Checkbox checked={value} onChange={onChange} />
                                        }
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name={"events"}
                                defaultValue={residence.events}
                                render={({ field: { onChange, value } }) => (
                                    <FormControlLabel
                                        label="Events Allowed"
                                        control={
                                            <Checkbox checked={value} onChange={onChange} />
                                        }
                                    />
                                )}
                            />
                            <InputLabel htmlFor="first-name-input">Update Residence Images</InputLabel>
                            <input
                                {...register("files")}
                                type="file"
                                multiple
                                onChange={handleFileChange}
                            />
                        </Grid>
                    </Grid>
                    <Button variant="contained" type="submit">
                       Submit Edited Residence
                    </Button>
                </CardContent>
            </form>
        </Card>
    );
};