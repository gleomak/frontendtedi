import {useAppDispatch, useAppSelector} from "../../store/configureStore";
import {useParams} from "react-router-dom";
import {fResidenceAsync, residencesSelectors} from "../catalog/catalogSlice";
import {useEffect, useState} from "react";
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
    ImageListItem,
    Input,
    InputLabel
} from "@mui/material";
import TextField from "@mui/material/TextField";
import * as React from "react";
import agent from "../../app/api/agent";


export default function MyResidenceEdit(){
    const dispatch = useAppDispatch();
    const {id} = useParams<{ id: string }>();
    const residence = useAppSelector(state => residencesSelectors.selectById(state, id!));
    const {status: residenceStatus} = useAppSelector(state => state.catalog);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImages, setSelectedImages] = useState<{ [key: string]: boolean }>({});
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
    const [imagesToAdd, setImagesToAdd] = useState<File[]>([]);
    const{register, handleSubmit, control, setError, setValue,
        formState:{ errors}} = useForm();
    const handleCheckboxChange = (imageUrl : string) => {
        const updatedSelection = { ...selectedImages };

        if (updatedSelection[imageUrl]) {
            delete updatedSelection[imageUrl];
        } else {
            updatedSelection[imageUrl] = true;
        }

        setSelectedImages(updatedSelection);
    };




    useEffect(() => {
        if (!residence){
            dispatch(fResidenceAsync(parseInt(id!))).then(() => setIsLoading(false));
        }
        if(residence){
            setValue('title', residence.title);
            setValue('neighborhood', residence.neighborhood);
            setValue('city',residence.city);
            setValue('country', residence.country);
            setValue('residenceCapacity', residence.residenceCapacity);
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
    }, [id, dispatch, residence,setValue]);

    if(!residence && isLoading) return(<LoadingComponent/>)
    if(!residence) return(<h3>Residence not found :(</h3>)


    const handleFileChange = (e : any) => {
        const files : File[] = Array.from(e.target.files);
        setImagesToAdd((prevSelectedFiles) => [...prevSelectedFiles, ...files]);
    };


    async function handleUpdateSubmit(data: FieldValues){
        const selectedImagesArray = Object.keys(selectedImages);
        setImagesToDelete(selectedImagesArray);
        const formData = new FormData();
        // formData.append('title', data.title);
        // formData.append('neighborhood', data.neighborhood);
        // formData.append('city',data.city);
        // formData.append('country', data.country);
        // formData.append('residenceCapacity', data.residenceCapacity);
        // formData.append('numOfBeds', data.numOfBeds);
        // formData.append('numOfBathrooms', data.numOfBathrooms);
        // formData.append('residenceType', data.residenceType);
        // formData.append('numOfBedrooms',data.numOfBedrooms);
        // formData.append('costPerNight', data.costPerNight);
        // formData.append( 'livingRoom', data.livingRoom);
        // formData.append( 'squareMeters', data.squareMeters);
        // formData.append( 'description', data.description);
        // formData.append('smoking', data.smoking);
        // formData.append( 'pets', data.pets);
        // formData.append( 'events', data.events);
        // formData.append( 'internet', data.internet);
        // formData.append('aircondition', data.aircondition);
        // formData.append( 'kitchen', data.kitchen);
        // formData.append('parkingSpot', data.parkingSpot);
        // formData.append( 'tv', data.tv);
        // formData.append('minDaysForReservation', data.minDaysForReservation);
        // formData.append( 'address', data.address);
        const namesAdd = Array.from(imagesToAdd).map((file) => file.name);
        imagesToAdd.forEach((filename) =>{
            formData.append('filesToAdd', filename);
        })
        // namesAdd.forEach((fileName) => {
        //     formData.append(`filesToAdd`, fileName);
        // });
        selectedImagesArray.forEach((fileName) =>{
           formData.append('imagesToDelete', fileName);
        });

        // console.log(selectedImagesArray);
        console.log(imagesToAdd);
        // console.log(namesAdd);
        await agent.Catalog.updateHostResidence(formData);
    }

    return(
        <Card raised={true}>
            <form onSubmit={handleSubmit(handleUpdateSubmit)}>
                <CardContent>
                    <Grid container spacing={3} alignItems="flex-start">
                        <Grid item xs={4} md={5}>
                            <ImageList sx={{ width: 450, height: 500 }} cols={2} rowHeight={164}>
                                {residence.imageURL.map((imageURL, index) => (
                                    <ImageListItem key={index}>
                                        <img
                                            src={`${imageURL}?w=150&h=150&fit=crop&auto=format`}
                                            srcSet={`${imageURL}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                            loading="lazy"
                                        />
                                        <label>
                                            <Checkbox
                                                checked={selectedImages[imageURL] || false}
                                                onChange={() => handleCheckboxChange(imageURL)}
                                            />
                                            Delete
                                        </label>
                                    </ImageListItem>
                                ))}
                            </ImageList>
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
                                label="Description"
                                {...register('description', {required: 'Description is required!'})}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                autoFocus
                                label="Residence Capacity"
                                {...register('residenceCapacity', {required: 'Residence Capacity is required!'})}
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
                            <InputLabel htmlFor="first-name-input">Profile picture</InputLabel>
                            <input
                                {...register("files")}
                                type="file"
                                multiple
                                onChange={handleFileChange}
                            />
                        </Grid>
                    </Grid>
                    <Button variant="contained" type="submit">
                        Delete Selected Images
                    </Button>
                </CardContent>
            </form>
        </Card>
    );
};