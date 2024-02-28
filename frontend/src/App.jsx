import {useMemo, useState} from "react";
import "./App.css";
import {
    AppBar,
    Container,
    createTheme,
    CssBaseline,
    IconButton,
    Link,
    Stack,
    ThemeProvider, Toolbar,
    Tooltip, Typography,
    useMediaQuery,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import {RouterProvider} from "react-router-dom";
import Routes from "./routes/Router.jsx";

function App() {
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const [darkMode, setDarkMode] = useState(prefersDarkMode);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: darkMode ? "dark" : "light",
                    // background: darkMode ? "#3f3f3f" : "#b7b7b7",
                },
            }),
        [darkMode],
    );

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <AppBar>
                <Toolbar>
                    <Typography variant={'h5'}>
                        RamsayAI
                    </Typography>
                    <Stack direction={'row'} spacing={1} paddingLeft={4}>
                        <Link href={'/gemini'} sx={{color: '#fff', textDecoration: 'none'}}>
                            Gemini
                        </Link>
                        <Link href={'/chatterbot'} sx={{color: '#fff', textDecoration: 'none'}}>
                            Chatterbot
                        </Link>
                    </Stack>
                    <Tooltip
                        title={darkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
                        sx={{position: "absolute", top: 12, right: 12}}
                    >
                        <IconButton onClick={toggleTheme}>
                            {darkMode ? <LightModeIcon/> : <DarkModeIcon/>}
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>
            <Container
                maxWidth={"md"}
                sx={{
                    p: 2,
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    minHeight: "100vh",
                }}
            >
                <RouterProvider router={Routes}/>
            </Container>
        </ThemeProvider>
    );
}

export default App;
