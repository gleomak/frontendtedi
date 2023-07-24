import ResidenceList from "./ResidenceList";
import {Residence} from "../../app/models/residence";
import {useEffect, useState} from "react";
import agent from "../../app/api/agent";

export default function Catalog(){
    const [residences, setResidences] = useState<Residence[]>([]);
    useEffect(() => {
        agent.Catalog.list().then(residences => setResidences(residences))
    }, [])
    return(
        <>
            <ResidenceList residences={residences}/>
        </>
    )

}