import {User} from "../../app/models/user";
import {createAsyncThunk, createSlice, isAnyOf} from "@reduxjs/toolkit";
import {FieldValues} from "react-hook-form";
import agent from "../../app/api/agent";
import {router} from "../../app/router/Routes";

interface AccountState{
    user: User | null;
}

const initialState: AccountState = {
    user : null
}

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
    initialState,
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
        }
    },
    extraReducers: (builder =>{
        builder.addMatcher(isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled), (state, action) => {
            let claims = JSON.parse(atob(action.payload.token.split('.')[1]));
            let roles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            state.user = {...action.payload, roles: typeof(roles) === 'string'? [roles] : roles};
        });
        builder.addMatcher(isAnyOf(signInUser.rejected, fetchCurrentUser.rejected, getUserDetails.rejected), (state, action) => {
            console.log(action.payload);
        })
    })
})

export const{signOut,setUser, resignOut} = accountSlice.actions;