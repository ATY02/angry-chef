import {useEffect, useMemo, useRef, useState} from "react";
import axios from "axios";
import "./App.css";
import {
    Box,
    Container,
    createTheme,
    CssBaseline,
    IconButton,
    LinearProgress,
    Paper,
    Stack,
    TextField,
    ThemeProvider,
    Tooltip,
    Typography,
    useMediaQuery,
} from "@mui/material";
import ArrowCircleUpRoundedIcon from "@mui/icons-material/ArrowCircleUpRounded";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import ReactMarkdown from "react-markdown";

function App() {
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const [darkMode, setDarkMode] = useState(prefersDarkMode);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: darkMode ? "dark" : "light",
                },
            }),
        [darkMode],
    );

    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const fetchChatHistory = () => {
        axios
            .get("http://localhost:8000/chat/history")
            .then((response) => {
                setChatHistory(response.data);
            })
            .catch((error) => {
                console.error("Error:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchChatHistory();
    }, []);

    useEffect(() => {
        messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
    }, [chatHistory]);

    const handleSendMessage = () => {
        if (!inputText.trim()) return;
        setLoading(true);

        setMessages([...messages, {text: inputText, isUser: true}]);
        setInputText("");

        axios
            .post("http://localhost:8000/chat", null, {
                params: {
                    message: inputText,
                },
            })
            .then((response) => {
                setMessages([
                    ...messages,
                    {text: response.data.message, isUser: false},
                ]);
            })
            .catch((error) => {
                console.error("Error:", error);
            });

        fetchChatHistory();
    };

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handledKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Tooltip
                title={darkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
                sx={{position: "absolute", top: 12, right: 12}}
            >
                <IconButton onClick={toggleTheme}>
                    {darkMode ? <LightModeIcon/> : <DarkModeIcon/>}
                </IconButton>
            </Tooltip>
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
                <Stack
                    direction="column"
                    justifyContent="flex-end"
                    alignItems="center"
                    spacing={1}
                    sx={{
                        flex: "1 1 auto", position: "relative"
                    }}
                >
                    {chatHistory.map((message, index) => (
                        <div key={index}>
                            <Box
                                textAlign={"left"}
                                m={1}
                                p={1}
                                bgcolor={theme.palette.action.hover}
                                borderRadius={1}
                            >
                                <Typography variant={"h6"}>You</Typography>
                                <Typography variant={"body1"}>{message.message}</Typography>
                            </Box>
                            <Box textAlign={"left"} m={1} p={1}>
                                <Typography variant={"h6"}>Ramsay</Typography>
                                <ReactMarkdown
                                    skipHtml={false}
                                    components={{
                                        p: ({children, ...props}) => (
                                            <Typography variant={"body1"} {...props}>
                                                {children}
                                            </Typography>
                                        ),
                                    }}
                                >
                                    {message.response}
                                </ReactMarkdown>
                            </Box>
                        </div>
                    ))}
                    <div ref={messagesEndRef}/>
                </Stack>
                <Paper sx={{mt: 2}}>
                    {loading && (
                        <LinearProgress color={"secondary"} sx={{borderRadius: 2}}/>
                    )}
                    <Stack direction={"row"} spacing={1} sx={{p: 1}}>
                        <TextField
                            fullWidth
                            variant={"outlined"}
                            size={"small"}
                            placeholder={"Type your message..."}
                            value={inputText}
                            onChange={handleInputChange}
                            onKeyDown={handledKeyPress}
                            color={"secondary"}
                        />
                        <Tooltip title={"Send"}>
                            <IconButton
                                onClick={handleSendMessage}
                                size={"medium"}
                                disabled={loading}
                            >
                                <ArrowCircleUpRoundedIcon fontSize={"inherit"}/>
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}

export default App;
