import {configureStore, createStore} from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {accountSlice} from "../features/account/accountSlice";
import {catalogSlice} from "../features/catalog/catalogSlice";

// export function configureStore() {
//     return createStore(counterReducer);
// }

export const store = configureStore({
    reducer: {
        account: accountSlice.reducer,
        catalog: catalogSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;