import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {
    Box,
    IconButton,
    LinearProgress,
    Paper,
    Stack,
    TextField,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";
import ArrowCircleUpRoundedIcon from "@mui/icons-material/ArrowCircleUpRounded";
import ReactMarkdown from "react-markdown";

const Chat = () => {
    const theme = useTheme();

    const [inputText, setInputText] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const [baseUrl, setBaseUrl] = useState('');

    useEffect(() => {
        const currentUrl = window.location.href;
        if (currentUrl.includes('gemini')) {
            setBaseUrl('http://localhost:8000');
        } else {
            setBaseUrl('http://localhost:8001');
        }
    }, []);

    useEffect(() => {
        if (baseUrl) {
            fetchChatHistory();
        }
    }, [baseUrl]);

    const fetchChatHistory = () => {
        axios
            .get(`${baseUrl}/chat/history`)
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
        messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
    }, [chatHistory]);

    const handleSendMessage = () => {
        if (!inputText.trim()) return;
        setLoading(true);

        axios
            .post(`${baseUrl}/chat`, null, {
                params: {
                    message: inputText,
                },
            })
            .catch((error) => {
                console.error("Error:", error);
            })
            .finally(() => {
                fetchChatHistory();
            });

        setInputText("");
    };

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handledKeyPress = (e) => {
        // if (e.key === "Enter") {
        //     handleSendMessage();
        // }
    };

    return (
        <>
            <Stack direction={'column'} spacing={1}>
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
                            {message.message.split("\n").map((line, index) => (
                                <div key={index}>
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
                                        {line}
                                    </ReactMarkdown>
                                    {index !== message.message.split("\n").length - 1 ? <br/> : undefined}
                                </div>
                            ))}
                        </Box>
                        <Box textAlign={"left"} m={1} p={1}>
                            <Typography variant={"h6"}>Ramsay</Typography>
                            <ReactMarkdown
                                key={index}
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
                        multiline
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
        </>
    );
}

export default Chat;
