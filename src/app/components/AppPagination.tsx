import {Pagination} from "@mui/material";
import React from "react";
import {Metadata} from "../models/metadata";

interface Props{
    metadata: Metadata;
    onPageChange: (page:number) => void;
}
export default function AppPagination({metadata, onPageChange}: Props){
    const {currentPage,  totalPages} = metadata;
    return(
        <Pagination
            color='secondary'
            size='large'
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => onPageChange(page)}
        />
    )
}