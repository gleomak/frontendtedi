import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import {Residence, ResidenceSearch} from "../../app/models/residence";
import agent from "../../app/api/agent";
import {RootState} from "../../store/configureStore";
import {Metadata} from "../../app/models/metadata";

const residencesAdapter = createEntityAdapter<Residence>();

interface ResidenceState{
    residencesLoaded: boolean;
    status: string;
    residenceParams: ResidenceSearch;
    metadata: Metadata | null;
}

function getAxiosParams(residencePrams: ResidenceSearch, isTrue: boolean){
    const params = new URLSearchParams();
    params.append('pageNumber', residencePrams.pageNumber.toString());
    params.append('pageSize', residencePrams.pageSize.toString());
    if(residencePrams.from) {
        params.append('from', residencePrams.from.toString());
        isTrue = false;
    }
    if(residencePrams.to) {
        params.append('to', residencePrams.to.toString());
        isTrue = false;

    }
    if(residencePrams.city) {
        params.append('city', residencePrams.city.toString());
        isTrue = false;

    }
    if(residencePrams.country) {
        params.append('country', residencePrams.country.toString());
        isTrue = false;

    }
    if(residencePrams.neighborhood) {
        params.append('neighborhood', residencePrams.neighborhood.toString());
        isTrue = false;

    }
    if(residencePrams.numOfPeople) {
        params.append('numOfPeople', residencePrams.numOfPeople.toString());
        isTrue = false;

    }
    if(residencePrams.internet) {
        params.append('internet', residencePrams.internet.toString());
        isTrue = false;

    }
    if(residencePrams.tv) {
        params.append('tv', residencePrams.tv.toString());
        isTrue = false;

    }
    if(residencePrams.kitchen) {
        params.append('kitchen', residencePrams.kitchen.toString());
        isTrue = false;

    }
    if(residencePrams.aircondition) {
        params.append('aircondition', residencePrams.aircondition.toString());
        isTrue = false;

    }
    if(residencePrams.parkingSpot) {
        params.append('parkingSpot', residencePrams.parkingSpot.toString());
        isTrue = false;

    }
    return {params, isTrue};
}

export const fetchResidencesAsync = createAsyncThunk<Residence[], void, {state:RootState}>(
    'residence/fetchResidencesAsync',
    async (_,thunkAPI) => {
        const {params, isTrue} = getAxiosParams(thunkAPI.getState().catalog.residenceParams, true)
        console.log(isTrue);
        try{
            const response = (!isTrue) ? await agent.Catalog.list(params) : await agent.Catalog.getRecommendationResidences(params);
            thunkAPI.dispatch(setMetaData(response.metadata));
            return response.items;
        }catch(error){
            console.log(error);
        }
    }
)

export const fResidenceAsync = createAsyncThunk<Residence, number>(
    'residence/fResidencesAsync',
    async (residenceId) => {
        try{
            return await agent.Catalog.details(residenceId);
        }catch(error){
            console.log(error);
        }
    }
)

function initParams(): ResidenceSearch{
    return{
        city: null,
        country: null,
        neighborhood: null,
        pageSize : 10,
        pageNumber : 1
    }
}

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: residencesAdapter.getInitialState<ResidenceState>({
        residencesLoaded: false,
        status: 'idle',
        residenceParams: initParams(),
        metadata: null
    }),
    reducers: {
        setResidenceParams: (state, action) => {
            state.residencesLoaded = false;
            state.residenceParams = {...state.residenceParams, ...action.payload, pageNumber: 1};
        },
        setDateParams: (state, action) => {
            state.residencesLoaded = false;

            state.residenceParams = {...state.residenceParams, ...action.payload.toISOString(), pageNumber: 1};
        },
        setPageNumber: (state, action) => {
            state.residencesLoaded = false;
            state.residenceParams = {...state.residenceParams, ...action.payload};
        },
        setMetaData:(state, action) =>{
            state.metadata = action.payload;
        },
        setResidenceParamsNoState: (state, action) => {
            // state.residencesLoaded = false;
            state.residenceParams = {...state.residenceParams, ...action.payload};
        },
        setResidencesLoaded:(state) =>{
            state.residencesLoaded = false;
        },
        setFromDate: (state, action) => {
            state.residenceParams.from = action.payload.from.toISOString();
        },
        resetResidenceParams: (state) => {
            state.residencesLoaded = false;
            state.residenceParams = initParams()
        },
        setResidence: (state, action) =>{
            residencesAdapter.upsertOne(state, action.payload);
            state.residencesLoaded = false;
        },
        removeResidence: (state, action) =>{
            residencesAdapter.removeOne(state , action.payload);
            state.residencesLoaded = false;
}
    },
    extraReducers: (builder => {
        builder.addCase(fetchResidencesAsync.pending, (state) => {
            state.status = 'pendingFetchProducts';
        });
        builder.addCase(fetchResidencesAsync.fulfilled, (state, action) =>{
            residencesAdapter.setAll(state, action.payload);
            state.status = 'idle';
            state.residencesLoaded = true;
        });
        builder.addCase(fetchResidencesAsync.rejected, (state) =>{
            state.status = 'idle';
        });
        builder.addCase(fResidenceAsync.pending, (state) =>{
            state.status = 'pendingFetchProduct';
        });
        builder.addCase(fResidenceAsync.fulfilled, (state, action) =>{
            residencesAdapter.upsertOne(state, action.payload);
            state.status = 'idle';
        });
        builder.addCase(fResidenceAsync.rejected, (state) =>{
            state.status = 'idle';
        });
    })
})

export const residencesSelectors = residencesAdapter.getSelectors((state: RootState) => state.catalog);

export const {setResidenceParams,
    resetResidenceParams,
    setFromDate,
    setResidencesLoaded,
    setMetaData,
    setPageNumber,
    setResidence,
    removeResidence,} = catalogSlice.actions;