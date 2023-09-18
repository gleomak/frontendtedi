import {Message, User} from "../../app/models/user";
import {createAsyncThunk, createEntityAdapter, createSlice, isAnyOf} from "@reduxjs/toolkit";
import {FieldValues} from "react-hook-form";
import agent from "../../app/api/agent";
import {router} from "../../app/router/Routes";
import {Metadata} from "../../app/models/metadata";
import {RootState} from "../../store/configureStore";


const messagesAdapter = createEntityAdapter<Message>();


interface AccountState{
    user: User | null;
    status: string;
    messagesLoaded: boolean,
    metadata: Metadata | null;
    pageSize : number,
    pageNumber : number,
}

// const initialState: AccountState = {
//     user : null,
//     metadata : null,
//     status: 'idle',
//     pageSize : 10,
//     pageNumber : 1
// }

export const fetchMessagesAsync = createAsyncThunk<Message[], void, {state:RootState}>(
    'account/fetchMessagesAsync',
    async (_,thunkAPI) => {
        const params = new URLSearchParams();
        params.append('pageNumber', thunkAPI.getState().account.pageNumber.toString());
        params.append('pageSize', thunkAPI.getState().account.pageSize.toString());
        try{
            const response =  await agent.Account.getUserMessages(params);
            thunkAPI.dispatch(setMetaDataMessages(response.metadata));
            return response.items;
        }catch(error){
            console.log(error);
        }
    }
)


export const signInUser = createAsyncThunk<User,FieldValues>(
    'account/signInUser',
    async (data,thunkApi)=>{
        try {
            const user = await agent.Account.login(data);
            localStorage.setItem('user', JSON.stringify(user));
            // thunkApi.dispatch(setUser(user));
            return user;
        }
        catch (error: any){
            return thunkApi.rejectWithValue({error: error.data});
        }
    }
)

export const fetchCurrentUser = createAsyncThunk<User>(
    'account/fetchCurrentUser',
    async (_,thunkApi)=> {
        thunkApi.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)))
        try {
            const user = await agent.Account.currentUser();
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error: any) {
            return thunkApi.rejectWithValue({error: error.data});
        }
    },
    {
        condition: () => {
            if(!localStorage.getItem('user')) return false;
        }
    }
)

export const getUserDetails = createAsyncThunk<User>(
    'account/getUserDetails',
    async (_,thunkApi)=>{
        const params = new URLSearchParams();
        const user = JSON.parse(localStorage.getItem('user')!);
        const username = user.username;
        if(username != undefined) {
            params.append('username', username);
        }
        try {
            console.log(username);
            const user = await agent.Account.getUserDetails(params);
            return user;
        }
        catch (error: any){
            return thunkApi.rejectWithValue({error: error.data});
        }
    }
)

export const accountSlice = createSlice({
    name : 'account',
    initialState : messagesAdapter.getInitialState<AccountState>({
        messagesLoaded: false,
        user : null,
        metadata : null,
        status: 'idle',
        pageSize : 2,
        pageNumber : 1
    }),
    reducers:{
        signOut: (state) => {
            state.user = null;
            localStorage.removeItem('user');
            router.navigate('/');
        },
        resignOut: (state) => {
            state.user = null;
            localStorage.removeItem('user');
        },
        setUser: (state,action) => {
            let claims = JSON.parse(atob(action.payload.token.split('.')[1]));
            let roles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            state.user = {...action.payload, roles: typeof(roles) === 'string'? [roles] : roles};
        },
        setMetaDataMessages:(state, action) =>{
            state.metadata = action.payload;
        },
        setPageNumberMessages: (state, action) => {
            state.messagesLoaded = false;
            console.log('edwwww');
            state.pageNumber = action.payload;
        },
    },
    extraReducers: (builder =>{
        builder.addCase(fetchMessagesAsync.pending, (state) => {
            state.status = 'pendingFetchProducts';
        });
        builder.addCase(fetchMessagesAsync.fulfilled, (state, action) =>{
            messagesAdapter.setAll(state, action.payload);
            state.status = 'idle';
            state.messagesLoaded = true;
        });
        builder.addCase(fetchMessagesAsync.rejected, (state) =>{
            state.status = 'idle';
        });
        builder.addMatcher(isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled), (state, action) => {
            let claims = JSON.parse(atob(action.payload.token.split('.')[1]));
            let roles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            state.user = {...action.payload, roles: typeof(roles) === 'string'? [roles] : roles};
        });
        builder.addMatcher(isAnyOf(signInUser.rejected, fetchCurrentUser.rejected, getUserDetails.rejected), (state, action) => {
            console.log(action.payload);
        });
    })
})

export const messagesSelectors = messagesAdapter.getSelectors((state: RootState) => state.account);

export const{signOut,setUser, resignOut, setMetaDataMessages, setPageNumberMessages} = accountSlice.actions;