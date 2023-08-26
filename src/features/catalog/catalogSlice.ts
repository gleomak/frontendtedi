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

function getAxiosParams(residencePrams: ResidenceSearch){
    const params = new URLSearchParams();
    params.append('pageNumber', residencePrams.pageNumber.toString());
    params.append('pageSize', residencePrams.pageSize.toString());
    if(residencePrams.from) params.append('from', residencePrams.from);
    if(residencePrams.to) params.append('to', residencePrams.to.toString());
    if(residencePrams.city) params.append('city', residencePrams.city.toString());
    if(residencePrams.country) params.append('country', residencePrams.country.toString());
    if(residencePrams.neighborhood) params.append('neighborhood', residencePrams.neighborhood.toString());
    if(residencePrams.internet) params.append('internet', residencePrams.internet.toString());
    return params;
}

export const fetchResidencesAsync = createAsyncThunk<Residence[], void, {state:RootState}>(
    'residence/fetchResidencesAsync',
    async (_,thunkAPI) => {
        const params = getAxiosParams(thunkAPI.getState().catalog.residenceParams)
        try{
            const response =  await agent.Catalog.list(params);
            thunkAPI.dispatch(setMetaData(response.metadata));
            return response.items
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
        // from: null,
        // to:null,
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
            state.residenceParams.from = action.payload;
        },
        resetResidenceParams: (state) => {
            state.residencesLoaded = false;
            state.residenceParams = initParams()
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
    setPageNumber} = catalogSlice.actions;