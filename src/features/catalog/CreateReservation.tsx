import React, { useEffect, useState } from "react";
import {Navigate, useLocation, useNavigate, useParams} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { fResidenceAsync, residencesSelectors } from "./catalogSlice";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // Import the date range picker styles
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Grid, Button } from "@mui/material";
import "./CreateReservation.css";
import {toFormData} from "axios";
import agent from "../../app/api/agent";
import {Reservation} from "../../app/models/reservation";
import {ReservationFromTo} from "../../app/models/residence";
import {toast} from "react-toastify";

export default function CreateReservation() {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const residence = useAppSelector((state) =>
        residencesSelectors.selectById(state, id!)
    );
    const { status: residenceStatus } = useAppSelector((state) => state.catalog);

    const { residenceParams } = useAppSelector(state => state.catalog);

    const {user} = useAppSelector(state => state.account);

    const [selectedDateRange, setSelectedDateRange] = useState<{
        startDate: Date;
        endDate: Date;
        key: string;
    } | null>({
        startDate: (residenceParams.from !== undefined ? new Date(residenceParams.from!) : new Date()),
        endDate: (residenceParams.to !== undefined ? new Date(residenceParams.to!) : new Date()),
        key: "selection",
    });

    useEffect(() => {
        if (!residence) dispatch(fResidenceAsync(parseInt(id!)));
    }, [id, dispatch, residence]);

    if (residenceStatus.includes("pending")) return <h3>Loading...</h3>;
    if (!residence) return <h3>Product not found</h3>;

    const populateDisabledDates = (reservations: ReservationFromTo[]) => {
        const disabledDates: Date[] = [];

        reservations.forEach(reservation => {
            const currentDate = new Date(reservation.from);
            const endDate = new Date(reservation.to);

            while (currentDate <= endDate) {
                disabledDates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
            }
        })

        return disabledDates;
    }

    const disabledDays = populateDisabledDates(residence.reservationFromTo);

    const handleDateRangeChange = (ranges: { selection: { startDate: Date; endDate: Date } }) => {
        setSelectedDateRange({
            startDate: ranges.selection.startDate,
            endDate: ranges.selection.endDate,
            key: 'selection', // Add the 'key' property
        });
    };

    const calculateSelectedRangeDays = () => {
        if (selectedDateRange) {
            const { startDate, endDate } = selectedDateRange;
            const timeDifference = endDate.getTime() - startDate.getTime();
            const daysDifference = timeDifference / (1000 * 3600 * 24); // Convert milliseconds to days
            return daysDifference + 1; // Adding 1 to include both the start and end dates
        }
        return 0;
    };

    // Determine if the selected date range meets the minimum days requirement
    const isRangeValid = () => {
        const selectedDays = calculateSelectedRangeDays();
        return selectedDays >= residence.minDaysForReservation;
    };

    function formatDateToYYYYMMDD(inputDate : any) {
        const date = new Date(inputDate);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so we add 1
        const day = String(date.getDate()).padStart(2, '0');

        const formattedDate = `${year}/${month}/${day}`;

        return formattedDate;
    }

    const handleClick = async()=>{
        const formData=new FormData();
        const start = selectedDateRange?.startDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
        const end = selectedDateRange?.endDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
        formData.append('from', formatDateToYYYYMMDD(start).toString());
        formData.append('to', formatDateToYYYYMMDD(end).toString());
        formData.append('userId', user?.id.toString()!);
        formData.append('residenceId', residence.id.toString());

        if (!user) {
            toast.error('You have to Sign In first!');
            return navigate('/login', { state: { from: location } });
        }else if (user.roles && !user.roles.includes('Member')) {
            toast.error('Not authorized to create reservations!');
            return;
        }
        await dispatch(()=> agent.Catalog.postReservation(formData));
        navigate('/catalog');
    }

    return (
        <div className={"mainDiv"}>
            <h1 className={"title"}> Finalize your reservation </h1>
            <Grid container spacing={2}>
                <Grid item xs={6} md={8}>
                    <h1 className={"sub1"}>Select Reservation Dates</h1>
                    <DateRangePicker
                        ranges={[
                            {
                                startDate: selectedDateRange?.startDate || new Date(),
                                endDate: selectedDateRange?.endDate || new Date(),
                                key: 'selection',
                            }
                        ]}
                        onChange={handleDateRangeChange as any}
                        disabledDates={disabledDays}
                        minDate={new Date()}
                    />

                </Grid>
                <Grid item xs={2} md={4}>
                    <h1 className={"sub1"}>Residence</h1>
                    <p className={"residenceDet"}>
                        - <span className={"detail"}>{residence.title}</span> <br/>
                        - <span className={"detail"}>{residence.neighborhood}, {residence.city} ({residence.country}) </span> <br/>
                    </p>
                    <h1 className={"sub1"}>Cost</h1>
                     <span className={"detail"}>(Minimum stay is {residence.minDaysForReservation} days)</span> <br/>
                    - <span className={"detail"}> Total for {calculateSelectedRangeDays()} days is:</span> <br/>
                    <span className={"price"}> {residence.costPerNight*calculateSelectedRangeDays()} €</span>
                </Grid>
            </Grid>

            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '20px'}}>
                <Button
                    onClick = {handleClick}
                    variant="contained"
                    disableElevation
                    disabled={!isRangeValid()}
                    style={{
                        width: '500px',
                        height: '50px',
                        fontSize: '1rem'
                    }}
                >
                    Confirm Reservation
                </Button>
            </div>
        </div>
    );
}