import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { fResidenceAsync, residencesSelectors } from "./catalogSlice";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // Import the date range picker styles
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Grid, Button } from "@mui/material";

export default function CreateReservation() {
    const dispatch = useAppDispatch();
    const { id } = useParams<{ id: string }>();
    const residence = useAppSelector((state) =>
        residencesSelectors.selectById(state, id!)
    );
    const { status: residenceStatus } = useAppSelector((state) => state.catalog);

    const { residenceParams } = useAppSelector(state => state.catalog);

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

    const disabledDays: Date[] = [new Date("2023-09-05"), new Date("2023-09-10")]; // Add your disabled days here

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

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={6} md={8}>
                    <h1>Select Reservation Dates:</h1>
                </Grid>
                <Grid item xs={6} md={4}>
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
            </Grid>

            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Button
                    variant="contained"
                    disableElevation
                    disabled={!isRangeValid()}
                >
                    Confirm Reservation
                </Button>
            </div>
        </>
    );
}