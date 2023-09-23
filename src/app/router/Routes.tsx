import {createBrowserRouter} from "react-router-dom";
import App from "../layout/App";
import ControlPanel from "../../features/controlPanel/ControlPanel";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catalog/Catalog";
import ContactPage from "../../features/contact/ContactPage";
import ResidenceDetails from "../../features/catalog/ResidenceDetails";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import MyProfile from "../../features/account/MyProfile";
import Messages from "../../features/account/Messages";
import RequireAuth from "./RequireAuth";
import CreateReservation from "../../features/catalog/CreateReservation";
import MyResidences from "../../features/account/MyResidences";
import MyResidenceEdit from "../../features/account/MyResidenceEdit";
import CreateResidence from "../../features/catalog/CreateResidence";

export const router= createBrowserRouter([
    {
        path:'/',
        element: <App/>,
        children: [
            {element: <RequireAuth roles={['Admin']} />, children: [
                    {path: 'controlPanel', element: <ControlPanel />},
            ]},
            {element: <RequireAuth roles={['Host']} />, children: [
                    {path: 'myResidences', element: <MyResidences />},
                    {path: 'myResidenceEdit/:id', element: <MyResidenceEdit/>},
                    {path: 'createResidence', element: <CreateResidence/>}
            ]},
            {element: <RequireAuth roles={['Admin','Member','Host']} />, children: [
                    {path: 'messages', element: <Messages/>},
            ]},
            {path: '', element: <HomePage/>},
            {path: 'catalog', element: <Catalog/>},
            {path: 'catalog/:id', element: <ResidenceDetails/>},
            {path: 'catalog/reservation/:id', element: <CreateReservation/>},
            {path: 'contact', element: <ContactPage/>},
            {path: 'login', element: <Login/>},
            {path: 'register', element: <Register/>},
            {path: 'myProfile', element: <MyProfile/>}
        ]

    }
])