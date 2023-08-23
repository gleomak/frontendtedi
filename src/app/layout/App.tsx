import {useCallback, useEffect, useState} from "react";
import {Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import Header from "./Header";
import {Outlet} from "react-router-dom";
import {useAppDispatch} from "../../store/configureStore";
import {fetchCurrentUser} from "../../features/account/accountSlice";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";


function App() {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);

    const initApp = useCallback(async () => {
        try {
            await dispatch(fetchCurrentUser());
        } catch (error) {
            console.log(error);
        }
    }, [dispatch]);

    useEffect(() => {
        initApp().then(() => setLoading(false));
    }, [initApp])

    const [darkMode, setDarkMode] = useState(false);
    const paletteType = darkMode ? 'dark' : 'light';
    const theme = createTheme({
        palette:{
            mode: paletteType
        }
    })

    function handleThemeChange(){
        setDarkMode(!darkMode);
    }

    return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={theme}>
            <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
            <CssBaseline />
            <Header darkMode={darkMode} handleThemeChange={handleThemeChange}/>
            <Container>
                <Outlet/>
            </Container>
        </ThemeProvider>
    </LocalizationProvider>

  );
}

export default App;
