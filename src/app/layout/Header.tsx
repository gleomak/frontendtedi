import {AppBar, Box, List, ListItem, Switch, Toolbar} from "@mui/material";
import Typography from "@mui/material/Typography";
import {NavLink} from "react-router-dom";
import {useAppSelector} from "../../store/configureStore";
import SignedInMenu from "./SignedInMenu";

const midLinks= [
    {title:'catalog', path:'/catalog'},
    {title:'about', path:'/about'},
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

    return(
        <AppBar position='static' sx={{mb:4}}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box display='flex' alignItems='center'>
                    <Typography variant = 'h6' component={NavLink}
                                to='/'
                                sx={{color:'inherit', textDecoration:'none'}}
                    >
                        RE-STORE
                    </Typography>
                    <Switch checked={darkMode} onChange={handleThemeChange} />
                </Box>

                <Box display = 'flex' alignItems = 'Center'>
                    <List sx={{display:'flex'}}>
                        {midLinks.map(({title,path}) =>(
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