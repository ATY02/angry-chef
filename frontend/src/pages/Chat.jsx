import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {
    Box,
    Button,
    Container,
    IconButton,
    LinearProgress,
    Modal,
    Paper,
    Stack,
    TextField,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";
import ArrowCircleUpRoundedIcon from "@mui/icons-material/ArrowCircleUpRounded";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ReactMarkdown from "react-markdown";


const Chat = () => {
    const theme = useTheme();

    const [inputText, setInputText] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const [baseUrl, setBaseUrl] = useState('');


    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


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
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
            setInputText('');
        }
    };

    const handleClearChatHistory = () => {
        handleClose();
        setLoading(true);
        axios
            .post(`${baseUrl}/chat/history`)
            .catch((error) => {
                console.error("Error:", error);
            })
            .finally(() => {
                fetchChatHistory();
            });
    };

    return (
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
                    <Tooltip title={"Clear History"}>
                        <IconButton
                            onClick={handleOpen}
                            size={'medium'}
                            disabled={loading}
                        >
                            <DeleteRoundedIcon fontSize={'inherit'}/>
                        </IconButton>
                    </Tooltip>
                    <Modal
                        open={open}
                        onClose={handleClose}
                    >
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 2,
                        }}>
                            <Typography variant={'body1'} paddingBottom={3}>
                                Are you sure you want to clear chat history?
                            </Typography>
                            <Stack direction={'row'} justifyContent={'flex-end'} spacing={1}>
                                <Button color={'inherit'} onClick={handleClose}>Cancel</Button>
                                <Button
                                    color={'error'}
                                    onClick={handleClearChatHistory}
                                    variant={'contained'}
                                    loading={loading}
                                >Confirm</Button>
                            </Stack>
                        </Box>
                    </Modal>
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
        </Container>
    );
}

export default Chat;
