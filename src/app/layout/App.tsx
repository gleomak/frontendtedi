import {useCallback, useEffect, useState} from "react";
import {Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import Header from "./Header";
import Catalog from "../../features/catalog/Catalog";
import {Outlet} from "react-router-dom";
import {useAppDispatch} from "../../store/configureStore";
import {fetchCurrentUser} from "../../features/account/accountSlice";



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
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header darkMode={darkMode} handleThemeChange={handleThemeChange}/>
        <Container>
            <Outlet/>
        </Container>
    </ThemeProvider>
  );
}

export default App;
