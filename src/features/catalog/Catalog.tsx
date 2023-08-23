import ResidenceList from "./ResidenceList";
import {Residence} from "../../app/models/residence";
import {useEffect, useState} from "react";
import agent from "../../app/api/agent";
import {useAppDispatch, useAppSelector} from "../../store/configureStore";
import {fetchResidencesAsync, residencesSelectors} from "./catalogSlice";

export default function Catalog(){
    // const [residences, setResidences] = useState<Residence[]>([]);
    const residences = useAppSelector(residencesSelectors.selectAll);
    const {residencesLoaded} = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if(!residencesLoaded) dispatch(fetchResidencesAsync());
    }, [residencesLoaded, dispatch]);
    return(
        <>
            <ResidenceList residences={residences}/>
        </>
    )

}