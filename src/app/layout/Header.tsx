import {AppBar, Box, List, ListItem, Switch, Toolbar} from "@mui/material";
import Typography from "@mui/material/Typography";
import {NavLink} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../store/configureStore";
import SignedInMenu from "./SignedInMenu";
import {resetResidenceParams, residencesSelectors} from "../../features/catalog/catalogSlice";
import {useSelector} from "react-redux";

const midLinks= [
    {title:'catalog', path:'/catalog'},
    {title:'about', path:'/controlPanel'},
    {title:'contact', path:'/contact'},

]

const rightLinks= [
    {title:'login', path:'/login'},
    {title:'register', path:'/register'},
]

interface Props{
    darkMode: boolean;
    handleThemeChange: () => void;
}

export default function Header({darkMode,handleThemeChange}: Props){
    const {user} = useAppSelector(state => state.account);
    const dispatch = useAppDispatch();
    const {residenceParams} = useAppSelector(state => state.catalog );


    return(
        <AppBar position='static' sx={{mb:4}}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box display='flex' alignItems='center'>
                    <Typography variant = 'h6' component={NavLink}
                                to='/'
                                sx={{color:'inherit', textDecoration:'none'}}
                                onClick={ event => dispatch(resetResidenceParams())}
                    >
                        MMB
                    </Typography>
                    <Switch checked={darkMode} onChange={handleThemeChange} />
                </Box>

                <Box display = 'flex' alignItems = 'Center'>
                    {user && user.roles?.includes('Admin') &&
                        <ListItem
                            component={NavLink}
                            to={'/controlPanel'}
                            sx={{color:'inherit',typography:'h6'}}
                        >
                            Control Panel
                        </ListItem>}
                </Box>
                <Box display = 'flex' alignItems='center'>
                    {user ? (<SignedInMenu />) : (
                        <List sx={{display:'flex'}}>
                            {rightLinks.map(({title,path}) =>(
                                <ListItem
                                    component={NavLink}
                                    to={path}
                                    key={path}
                                    sx={{color:'inherit',typography:'h6'}}
                                >
                                    {title}
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    )
}