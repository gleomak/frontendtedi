import {createBrowserRouter} from "react-router-dom";
import App from "../layout/App";
import AboutPage from "../../features/about/AboutPage";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catalog/Catalog";
import ContactPage from "../../features/contact/ContactPage";
import ResidenceDetails from "../../features/catalog/ResidenceDetails";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";

export const router= createBrowserRouter([
    {
        path:'/',
        element: <App/>,
        children: [
            {path: '', element: <HomePage/>},
            {path: 'catalog', element: <Catalog/>},
            {path: 'catalog/:id', element: <ResidenceDetails/>},
            {path: 'about', element: <AboutPage/>},
            {path: 'contact', element: <ContactPage/>},
            {path: 'login', element: <Login/>},
            {path: 'register', element: <Register/>},
        ]

    }
])