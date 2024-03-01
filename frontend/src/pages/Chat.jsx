import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {
    Box, Container,
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
import angryRamsay1 from '../../public/AngryRamsay1.png';
import angryRamsay2 from '../../public/AngryRamsay2.png';
import disappointedRamsay from '../../public/DisappointedRamsay.png';
import happyRamsay from '../../public/HappyRamsay.png';
import neutralRamsay from '../../public/NeutralRamsay.png';
import ramsay from '../../public/ramsay.png';

function getRandomImage(chatHistoryLength) {
    const images = [angryRamsay1, angryRamsay2, disappointedRamsay, happyRamsay, neutralRamsay, ramsay];

    const randomIndex = Math.floor(Math.random() * chatHistoryLength) % images.length;

    return images[randomIndex];
}

function getSpecificImage(emotionalState) {
    const images = [angryRamsay1, angryRamsay2, disappointedRamsay, happyRamsay, neutralRamsay, ramsay];
    return images[emotionalState];
}

const Chat = () => {
    const theme = useTheme();

    const [inputText, setInputText] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const [baseUrl, setBaseUrl] = useState('');

    const [gordonImg, setGordonImg] = useState(ramsay);

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
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    useEffect(() => {
        let img = 5;
        console.log(chatHistory);
        if (chatHistory.length > 0) {
            if (chatHistory[chatHistory.length - 1].emotion) {
                img = chatHistory[chatHistory.length - 1].emotion;
            }
        }

        setGordonImg(getSpecificImage(img));
    }, [chatHistory]);

    return (
        <>
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
                                    {message.emotion}
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
            <Box sx={{position: 'fixed', bottom: 0, right: 0}}>
                <img src={gordonImg} style={{width: '250px', height: 'auto'}}/>
            </Box>
        </>
    );
}

export default Chat;
